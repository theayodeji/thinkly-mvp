import { useState, useCallback, useRef, useEffect, memo } from "react";
import ChatInput from "./ChatInput";
import SummaryBlock from "./SummaryBlock";
import { useStreaming } from "../../hooks/useStreaming";
import ChatMessage from "./ChatMessage";
import { useChatWithNote, useNote } from "../../hooks/queries/useNotes";
import { useParams } from "react-router-dom";

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
  const { id: noteId } = useParams<{ id: string }>();
  const { data: currentNote } = useNote(noteId || "");
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const { mutateAsync: chatWithNote, isPending: isChatLoading } = useChatWithNote();
  
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

  const handleSend = useCallback(async (message: string) => {
    if (!message.trim() || !noteId) return;
    
    // Add user message to UI immediately
    const newUserMsg = { role: "user" as const, content: message };
    setChatHistory(prev => [...prev, newUserMsg]);
    scrollToBottom();

    try {
      const response = await chatWithNote({
        noteId,
        message,
        history: chatHistory
      });
      setChatHistory(prev => [...prev, { role: "assistant" as const, content: response.response }]);
    } catch (error) {
      console.error(error);
    }
  }, [noteId, chatWithNote, chatHistory, scrollToBottom]);

  // Clean up on unmount
  useEffect(() => {
    return () => setChatHistory([]);
  }, []);

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
        isActionLoading={isChatLoading}
        chatHistory={chatHistory}
        currentNoteId={noteId}
        hasSources={currentNote?.sources ? currentNote.sources.length > 0 : false}
      />
    </div>
  );
}

export default memo(ChatInterface);
