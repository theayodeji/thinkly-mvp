import { RefObject, useEffect, useRef, useState } from "react";

export type ChatMessage = { role: "user" | "assistant"; content: string };

interface UseStreamingOptions {
  chunkSize?: number; // characters per tick
  intervalMs?: number; // streaming speed
  autoScrollRef?: RefObject<HTMLElement | null> | RefObject<HTMLDivElement | null>;
  autoScroll?: boolean;
}

interface UseStreamingResult {
  streamingIndex: number | null;
  streamedText: string;
  isUserScrolledUp: boolean;
}

/**
 * Streams the content of the most recent assistant message in a list of chat messages.
 * - Starts streaming when a new assistant message with content appears at the end of the list.
 * - Cleans up on unmount or when messages change mid-stream.
 * - Optionally auto-scrolls a provided container to bottom during streaming.
 */
export function useStreaming(
  messages: ChatMessage[],
  options: UseStreamingOptions = {}
): UseStreamingResult {
  const { chunkSize = 3, intervalMs = 10, autoScrollRef, autoScroll = true } = options;

  const [streamedText, setStreamedText] = useState<string>("");
  const [streamingIndex, setStreamingIndex] = useState<number | null>(null);
  const [isUserScrolledUp, _setIsUserScrolledUp] = useState(false);
  const streamTimerRef = useRef<number | null>(null);
  const lastScrollTop = useRef(0);
  const isUserScrolledUpRef = useRef(false);
  
  // Keep ref in sync with state
  const setIsUserScrolledUp = useRef((value: boolean) => {
    isUserScrolledUpRef.current = value;
    _setIsUserScrolledUp(value);
  }).current;

  useEffect(() => {
    if (!messages.length) return;

    const lastIndex = messages.length - 1;
    const lastMsg = messages[lastIndex];

    // Only stream assistant messages
    if (lastMsg.role !== "assistant" || !lastMsg.content) return;

    // Reset any existing stream
    if (streamTimerRef.current) {
      window.clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }

    setStreamingIndex(lastIndex);
    setStreamedText("");

    let i = 0;

    const id = window.setInterval(() => {
      i = Math.min(i + chunkSize, lastMsg.content.length);
      setStreamedText(lastMsg.content.slice(0, i));

      if (autoScroll && autoScrollRef?.current && !isUserScrolledUpRef.current) {
        const el = autoScrollRef.current as HTMLDivElement;
        el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
      }

      if (i >= lastMsg.content.length) {
        window.clearInterval(id);
        streamTimerRef.current = null;
        setStreamingIndex(null);
      }
    }, intervalMs);

    streamTimerRef.current = id;

    // Cleanup if component unmounts or messages update mid-stream
    return () => {
      if (streamTimerRef.current) {
        window.clearInterval(streamTimerRef.current);
        streamTimerRef.current = null;
      }
    };
  }, [messages, chunkSize, intervalMs, autoScroll, autoScrollRef]);

  // Handle scroll events to detect user scrolling up
  useEffect(() => {
    if (!autoScrollRef?.current) return;

    const handleScroll = () => {
      const el = autoScrollRef.current as HTMLDivElement;
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight;
      const clientHeight = el.clientHeight;
      const scrollThreshold = 50; // pixels from bottom to consider "scrolled up"
      
      // Check if user has scrolled up
      if (scrollTop + clientHeight < scrollHeight - scrollThreshold) {
        setIsUserScrolledUp(true);
      } else if (scrollTop + clientHeight >= scrollHeight - scrollThreshold) {
        // User has scrolled back to bottom
        setIsUserScrolledUp(false);
      }
      
      lastScrollTop.current = scrollTop;
    };

    const el = autoScrollRef.current;
    el.addEventListener('scroll', handleScroll);
    
    return () => {
      el.removeEventListener('scroll', handleScroll);
    };
  }, [autoScrollRef, setIsUserScrolledUp]);

  // Reset scroll state when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setIsUserScrolledUp(false);
      
      // Force scroll to bottom when new message arrives and user is at bottom
      if (autoScrollRef?.current && !isUserScrolledUpRef.current) {
        const el = autoScrollRef.current as HTMLDivElement;
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages.length, autoScrollRef, setIsUserScrolledUp]);

  return { streamingIndex, streamedText, isUserScrolledUp };
}
