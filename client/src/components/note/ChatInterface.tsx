import { useCallback, useEffect, useRef, memo } from "react";
import ChatInput from "./ChatInput";
import SummaryBlock from "./SummaryBlock";
import { useNoteStore } from "../../store/noteStore";
import { useStreaming } from "../../hooks/useStreaming";
import ChatMessage from "./ChatMessage";

// Memoize the loading indicator to prevent unnecessary re-renders
const LoadingIndicator = memo(() => (
  <div className="max-w-[80%] px-3 py-2 rounded-lg text-sm text-wrap bg-bg text-text self-start">
    <div className="flex space-x-2">
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
    </div>
  </div>
));

LoadingIndicator.displayName = 'LoadingIndicator';

function ChatInterface() {
  const { 
    currentNote, 
    isChatLoading, 
    chatHistory, 
    clearChat, 
    isActionLoading,
    chatWithNote 
  } = useNoteStore();
  
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // Streaming of the latest assistant message
  const { streamingIndex, streamedText } = useStreaming(chatHistory, {
    chunkSize: 3,
    intervalMs: 10,
    autoScrollRef: chatBoxRef,
  });

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      chatBoxRef.current?.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, []);

  const handleSend = useCallback((message: string) => {
    if (!message.trim() || !currentNote?._id) return;
    
    // Initial scroll
    scrollToBottom();
    // chatWithNote(currentNote._id, message);
    // The actual chat operation is now handled in ChatInput
  }, [currentNote?._id, scrollToBottom, chatWithNote]);

  // Clean up on unmount
  useEffect(() => {
    return () => clearChat();
  }, [clearChat]);

  // Memoize the chat messages to prevent re-renders when only the input changes
  const renderedMessages = useCallback(() => {
    return chatHistory.map((msg, i) => (
      <ChatMessage
        key={`${msg.role}-${i}`}
        message={msg}
        isStreaming={streamingIndex === i && msg.role === "assistant"}
        streamedText={streamedText}
      />
    ));
  }, [chatHistory, streamingIndex, streamedText]);

  return (
    <div className="flex flex-col h-full">
      <div
        ref={chatBoxRef}
        className="flex-1 flex flex-col overflow-y-auto p-4 space-y-3 pb-10"
      >
        <SummaryBlock />
        {renderedMessages()}
        {isChatLoading && <LoadingIndicator />}
      </div>

      <ChatInput 
        onSend={handleSend}
        isActionLoading={isActionLoading}
        chatHistory={chatHistory}
        currentNoteId={currentNote?._id}
      />
    </div>
  );
}

export default memo(ChatInterface);
