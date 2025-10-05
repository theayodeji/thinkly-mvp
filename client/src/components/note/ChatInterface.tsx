import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/Button";
import { SendIcon } from "lucide-react";
import SummaryBlock from "./SummaryBlock";
import { useNoteStore } from "../../store/noteStore";
import { useStreaming } from "../../hooks/useStreaming";
import ChatSuggestions from "./ChatSuggestions";
import ChatMessage from "./ChatMessage";

export default function Chat() {
  const { currentNote, isChatLoading, chatWithNote, chatHistory, clearChat, isActionLoading } =
    useNoteStore();
  const [input, setInput] = useState("");
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // Streaming of the latest assistant message
  const { streamingIndex, streamedText } = useStreaming(chatHistory, {
    chunkSize: 3,
    intervalMs: 10,
    autoScrollRef: chatBoxRef,
  });

  const handleSend = () => {
    if (!input.trim()) return;
    const message = input.trim();
    setInput("");

    chatWithNote(currentNote?._id as string, message).then(() => {
      // Scroll again after the response is received
      requestAnimationFrame(() => {
        chatBoxRef.current?.scrollTo({
          top: chatBoxRef.current.scrollHeight,
          behavior: "smooth",
        });
      });
    });
    
    requestAnimationFrame(() => {
      chatBoxRef.current?.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  useEffect(() => {
    return () => clearChat();
  }, [clearChat]);

  return (
    <div className="flex flex-col h-full">
      <div
        ref={chatBoxRef}
        className="flex-1 flex flex-col overflow-y-auto p-4 space-y-3 pb-10"
      >
        <SummaryBlock />
        {/* Messages */}
        {chatHistory.map((msg, i) => (
          <ChatMessage
            key={`${msg.role}-${i}`}
            message={msg}
            isStreaming={streamingIndex === i && msg.role === "assistant"}
            streamedText={streamedText}
          />
        ))}
        {isChatLoading && (
          <div className="max-w-[80%] px-3 py-2 rounded-lg text-sm text-wrap bg-bg text-text self-start">
            {/* three circle bounce animation with delay*/}
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="rounded-b-lg border-1 border-neutral-300 dark:border-neutral-700 sm:px-4 sm:py-4 px-2 py-2 flex items-end gap-2 relative">
        <textarea
          className="bg-bg flex-1 rounded-lg border border-neutral-300 dark:border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-none focus:bg-bg/50 resize-none min-h-[36px] max-h-[150px] leading-tight transition-all duration-200"
          placeholder="Ask anything..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          rows={1}
        />
        <Button
          variant="primary"
          size="sm"
          icon={<SendIcon />}
          onClick={handleSend}
          disabled={currentNote?.sources?.length === 0}
        >
          Send
        </Button>
        {chatHistory.length == 0 && !isActionLoading && (
          <ChatSuggestions chatWithNote={chatWithNote} />
        )}
      </div>
    </div>
  );
}
