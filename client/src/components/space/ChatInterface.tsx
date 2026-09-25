import { useState, useCallback, useRef, useEffect, useLayoutEffect, memo } from "react";
import ChatInput from "./ChatInput";
import SummaryBlock from "./SummaryBlock";
import { useSmoothStreaming } from "../../hooks/useSmoothStreaming";
import ChatMessage from "./ChatMessage";
import { useSpaceSources, useChatHistory } from "../../hooks/queries/useSpaces";
import { useParams } from "react-router-dom";
import { spaceService } from "../../shared/services/spaceService";



import { useQueryClient } from "@tanstack/react-query";

function ChatInterface() {
  const { id: spaceId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: sources } = useSpaceSources(spaceId || "");
  const { 
    data: serverHistory, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    isLoading: isHistoryLoading
  } = useChatHistory(spaceId || "");

  const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  
  const previousScrollHeightRef = useRef<number>(0);
  const isFetchingOlderRef = useRef<boolean>(false);
  const isInitialLoadRef = useRef<boolean>(true);

  useEffect(() => {
    if (serverHistory) {
      // Pages are ordered newest page to oldest page (e.g. page 0 has most recent messages)
      // So to get chronological order, we reverse the pages array, then flatMap.
      const flattenedHistory = [...serverHistory.pages].reverse().flatMap(page => page.history);
      
      setChatHistory(prev => {
        // Only set the ref if we are actively prepending older messages
        if (!isInitialLoadRef.current && flattenedHistory.length > prev.length && flattenedHistory.length > 0 && prev.length > 0) {
            // The first message of the new flattened history should be older than the previous first message
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

  // Use layout effect to adjust scroll position synchronously after older messages render
  useLayoutEffect(() => {
    if (isFetchingOlderRef.current && chatBoxRef.current) {
      const newScrollHeight = chatBoxRef.current.scrollHeight;
      const heightDifference = newScrollHeight - previousScrollHeightRef.current;
      chatBoxRef.current.scrollTop += heightDifference;
      isFetchingOlderRef.current = false;
    }
  }, [chatHistory]);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      chatBoxRef.current?.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, []);

  const handleScroll = useCallback(() => {
    if (!chatBoxRef.current) return;
    if (chatBoxRef.current.scrollTop <= 5 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const [isChatLoading, setIsChatLoading] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  // Increased speed: 5ms interval, 4 characters per tick (feels much faster but still smooth)
  const { displayedText: smoothedStreamedText, isCaughtUp } = useSmoothStreaming(streamedText, 5, 4);
  const [streamingIndex, setStreamingIndex] = useState<number | null>(null);
  const [isNetworkFinished, setIsNetworkFinished] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // When the network stream finishes AND the smooth text catches up, we finalize the message
    if (isNetworkFinished && isCaughtUp && streamingIndex !== null) {
      setChatHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = { role: "assistant", content: streamedText };
        return newHistory;
      });
      setStreamingIndex(null);
      setStreamedText("");
      setIsNetworkFinished(false);
      abortControllerRef.current = null;
      queryClient.invalidateQueries({ queryKey: ["spaces", spaceId, "chat"] });
    }
  }, [isNetworkFinished, isCaughtUp, streamingIndex, streamedText, spaceId, queryClient]);

  const handleStop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // Immediately finalize using the current SMOOTHED text, so we stop exactly where the user is looking
    setChatHistory(prev => {
      // Check if we are actually streaming
      if (streamingIndex === null) return prev;
      
      const newHistory = [...prev];
      // Use smoothedStreamedText to stop exactly what is on screen
      newHistory[newHistory.length - 1] = { role: "assistant", content: smoothedStreamedText };
      return newHistory;
    });
    setStreamingIndex(null);
    setStreamedText("");
    setIsNetworkFinished(false);
    queryClient.invalidateQueries({ queryKey: ["spaces", spaceId, "chat"] });
  }, [smoothedStreamedText, streamingIndex, spaceId, queryClient]);

  const handleSend = useCallback(async (message: string) => {
    if (!message.trim() || !spaceId) return;
    
    // Add user message to UI immediately with a stable temp ID
    const newUserMsg = { _id: crypto.randomUUID(), role: "user" as const, content: message };
    setChatHistory(prev => [...prev, newUserMsg as any]);
    scrollToBottom();
    
    setIsChatLoading(true);
    setIsNetworkFinished(false);
    
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Add a placeholder for the assistant message and set streaming index
      setChatHistory(prev => {
        setStreamingIndex(prev.length);
        return [...prev, { _id: crypto.randomUUID(), role: "assistant" as const, content: "" } as any];
      });
      setIsChatLoading(false); // Stop the global loading indicator since we are streaming now

      await spaceService.streamChat(spaceId, message, (fullResponse) => {
        setStreamedText(fullResponse);
        scrollToBottom();
      }, controller.signal);

      // Mark the network request as complete. The useEffect will finalize once caught up.
      setIsNetworkFinished(true);

    } catch (error: any) {
      if (error?.name === 'CanceledError' || error?.message === 'canceled' || error?.code === 'ERR_CANCELED') {
        console.log('Stream aborted by user');
        return; // handleStop handles the finalization immediately
      }
      console.error(error);
      setIsChatLoading(false);
      
      // Update the placeholder with a helpful error message
      setChatHistory(prev => {
        if (streamingIndex === null) return prev; // Just in case
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = { 
          role: "assistant", 
          content: "Sorry, I ran into an error while generating a response. Please try again or check your connection."
        };
        return newHistory;
      });
      
      setStreamingIndex(null);
      setStreamedText("");
      setIsNetworkFinished(false);
      abortControllerRef.current = null;
    }
  }, [spaceId, scrollToBottom]);

  // Clean up on unmount
  useEffect(() => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    return () => setChatHistory([]);
  }, [spaceId]);

  useEffect(() => {
    if (streamingIndex !== null) {
      scrollToBottom();
    }
  }, [smoothedStreamedText, streamingIndex, scrollToBottom]);

  const renderedMessages = useCallback(() => {
    return chatHistory.map((msg: any, i) => {
      // Use _id if available (from DB). For optimistic UI messages, fallback to their array index 
      // mixed with role. Or we can generate a random id during creation.
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
      />
    </div>
  );
}

export default memo(ChatInterface);
