import { useState, useCallback, useRef, useEffect, useLayoutEffect, memo } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import SummaryBlock from "./SummaryBlock";
import { useSmoothStreaming } from "../../hooks/useSmoothStreaming";
import { useSpaceSources, useChatHistory } from "../../hooks/queries/useSpaces";
import { spaceService } from "../../shared/services/spaceService";

import { usePermissionsAndLimits, MeteredMetric } from "../../hooks/usePermissionsAndLimits";

function ChatInterface() {
  const { id: spaceId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { getLimitStatus, triggerLimitModal } = usePermissionsAndLimits();

  // Remote Queries
  const { data: sources } = useSpaceSources(spaceId || "");
  const {
    data: serverHistory,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isHistoryLoading,
  } = useChatHistory(spaceId || "");

  // Local Chat & Streaming State
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const { displayedText: smoothedStreamedText, isCaughtUp } = useSmoothStreaming(streamedText, 5, 4);
  const [streamingIndex, setStreamingIndex] = useState<number | null>(null);
  const [isNetworkFinished, setIsNetworkFinished] = useState(false);

  // Layout & Scroll References
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number>(0);
  const isFetchingOlderRef = useRef<boolean>(false);
  const isInitialLoadRef = useRef<boolean>(true);
  const userTetherBrokenRef = useRef<boolean>(false);
  const lastScrollTopRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const userMessagesCount = chatHistory.filter((m) => m.role === "user").length;
  const chatLimitStatus = getLimitStatus(MeteredMetric.CHAT_MESSAGES, { spaceId: spaceId || "", messagesCount: userMessagesCount });

  // Sync server history to local state
  useEffect(() => {
    if (serverHistory) {
      // History pages are ordered newest to oldest; reverse pages to construct chronological order
      const flattenedHistory = [...serverHistory.pages].reverse().flatMap((page) => page.history);

      setChatHistory((prev) => {
        if (!isInitialLoadRef.current && flattenedHistory.length > prev.length && prev.length > 0) {
          isFetchingOlderRef.current = true;
          if (chatBoxRef.current) {
            previousScrollHeightRef.current = chatBoxRef.current.scrollHeight;
          }
        }
        return flattenedHistory;
      });

      if (isInitialLoadRef.current && serverHistory.pages.length > 0) {
        isInitialLoadRef.current = false;
        setTimeout(() => {
          if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
          }
        }, 50);
      }
    }
  }, [serverHistory]);

  // Adjust scroll position after prepending older messages
  useLayoutEffect(() => {
    if (isFetchingOlderRef.current && chatBoxRef.current) {
      const newScrollHeight = chatBoxRef.current.scrollHeight;
      const heightDifference = newScrollHeight - previousScrollHeightRef.current;
      chatBoxRef.current.scrollTop += heightDifference;
      isFetchingOlderRef.current = false;
    }
  }, [chatHistory]);

  // Scroll to bottom helper respecting user scroll tether
  const scrollToBottom = useCallback((force = false) => {
    if (!chatBoxRef.current) return;

    if (force) {
      userTetherBrokenRef.current = false;
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      return;
    }

    if (userTetherBrokenRef.current) return;

    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, []);

  // Handle manual container scroll to detect user scrolling away from bottom or triggering pagination
  const handleScroll = useCallback(() => {
    if (!chatBoxRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatBoxRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    if (streamingIndex !== null) {
      if (scrollTop < lastScrollTopRef.current || distanceFromBottom > 25) {
        userTetherBrokenRef.current = true;
      } else if (distanceFromBottom <= 15) {
        userTetherBrokenRef.current = false;
      }
    } else {
      if (distanceFromBottom <= 15) {
        userTetherBrokenRef.current = false;
      }
    }

    lastScrollTopRef.current = scrollTop;

    if (scrollTop <= 5 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [streamingIndex, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Break tether immediately on user wheel or touch interaction
  useEffect(() => {
    const el = chatBoxRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < 0 || el.scrollHeight - el.scrollTop - el.clientHeight > 15) {
        userTetherBrokenRef.current = true;
      }
    };

    const onTouchMove = () => {
      if (el.scrollHeight - el.scrollTop - el.clientHeight > 15) {
        userTetherBrokenRef.current = true;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  // Finalize assistant message when network stream ends and smooth rendering catches up
  useEffect(() => {
    if (isNetworkFinished && isCaughtUp && streamingIndex !== null) {
      setChatHistory((prev) => {
        const newHistory = [...prev];
        const prevMsg = newHistory[newHistory.length - 1];
        newHistory[newHistory.length - 1] = { ...prevMsg, role: "assistant", content: streamedText };
        return newHistory;
      });
      setStreamingIndex(null);
      setStreamedText("");
      setIsNetworkFinished(false);
      abortControllerRef.current = null;
      queryClient.invalidateQueries({ queryKey: ["spaces", spaceId, "chat"] });
    }
  }, [isNetworkFinished, isCaughtUp, streamingIndex, streamedText, spaceId, queryClient]);

  // Auto-scroll on smooth text ticks
  useEffect(() => {
    if (streamingIndex !== null) {
      scrollToBottom();
    }
  }, [smoothedStreamedText, streamingIndex, scrollToBottom]);

  // Stop active stream
  const handleStop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setChatHistory((prev) => {
      const newHistory = [...prev];
      const lastMsg = newHistory[newHistory.length - 1];
      if (lastMsg && lastMsg.role === "assistant") {
        newHistory[newHistory.length - 1] = { ...lastMsg, content: smoothedStreamedText };
      }
      return newHistory;
    });
    setStreamingIndex(null);
    setStreamedText("");
    setIsNetworkFinished(false);
    queryClient.invalidateQueries({ queryKey: ["spaces", spaceId, "chat"] });
  }, [smoothedStreamedText, spaceId, queryClient]);

  // Send prompt
  const handleSend = useCallback(
    async (message: string) => {
      if (!message.trim() || !spaceId) return;

      if (chatLimitStatus.isReached || chatLimitStatus.isLocked) {
        triggerLimitModal("You've reached your chat limit for this space. Delete it and create a new one to continue!");
        return;
      }

      const newUserMsg = { _id: crypto.randomUUID(), role: "user" as const, content: message };
      setChatHistory((prev) => [...prev, newUserMsg as any]);
      scrollToBottom(true);

      setIsChatLoading(true);
      setIsNetworkFinished(false);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        setChatHistory((prev) => {
          setStreamingIndex(prev.length);
          return [...prev, { _id: crypto.randomUUID(), role: "assistant" as const, content: "" } as any];
        });
        setIsChatLoading(false);

        await spaceService.streamChat(
          spaceId,
          message,
          (fullResponse) => {
            setStreamedText(fullResponse);
            scrollToBottom();
          },
          controller.signal,
        );

        setIsNetworkFinished(true);
      } catch (error: any) {
        if (error?.name === "CanceledError" || error?.message === "canceled" || error?.code === "ERR_CANCELED") {
          return;
        }
        console.error(error);
        setIsChatLoading(false);

        const errorMessage =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Sorry, I ran into an error while generating a response. Please try again or check your connection.";

        setChatHistory((prev) => {
          const newHistory = [...prev];
          const lastMsg = newHistory[newHistory.length - 1];
          if (lastMsg && lastMsg.role === "assistant" && lastMsg.content === "") {
            newHistory[newHistory.length - 1] = {
              ...lastMsg,
              content: `⚠️ **Error:** ${errorMessage}`,
            };
          }
          return newHistory;
        });

        setStreamingIndex(null);
        setStreamedText("");
        setIsNetworkFinished(false);
        abortControllerRef.current = null;
      }
    },
    [spaceId, scrollToBottom, chatLimitStatus, triggerLimitModal],
  );

  // Unmount cleanup
  useEffect(() => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    return () => setChatHistory([]);
  }, [spaceId]);

  const renderedMessages = useCallback(() => {
    return chatHistory.map((msg: any, i) => {
      const key = msg._id || `temp-${msg.role}-${i}`;
      return (
        <ChatMessage
          key={key}
          message={msg}
          isStreaming={streamingIndex === i && msg.role === "assistant"}
          streamedText={smoothedStreamedText}
        />
      );
    });
  }, [chatHistory, streamingIndex, smoothedStreamedText]);

  return (
    <div className="flex flex-col h-full">
      <div
        ref={chatBoxRef}
        onScroll={handleScroll}
        className="flex-1 flex flex-col overflow-y-auto p-4 space-y-3 pb-10"
      >
        <SummaryBlock />
        {(isFetchingNextPage || isHistoryLoading) && (
          <div className="flex justify-center py-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
          </div>
        )}
        {renderedMessages()}
      </div>

      <ChatInput
        onSend={handleSend}
        onStop={handleStop}
        isActionLoading={isChatLoading || streamingIndex !== null}
        chatHistory={chatHistory}
        currentSpaceId={spaceId}
        hasSources={sources ? sources.length > 0 : false}
        isDisabled={chatLimitStatus.isReached || chatLimitStatus.isLocked}
        disabledReason={chatLimitStatus.isLocked ? "Chat is locked" : `Limit reached (${chatLimitStatus.max}/${chatLimitStatus.max})`}
      />
    </div>
  );
}

export default memo(ChatInterface);
