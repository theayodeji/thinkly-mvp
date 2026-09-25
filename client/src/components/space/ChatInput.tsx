import React, { useState, useCallback, useRef } from "react";
import { Button } from "../ui/Button";
import { SendIcon, Paperclip, Search, Wand2, Square } from "lucide-react";
import ChatSuggestions from "./ChatSuggestions";

interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  onStop?: () => void;
  isActionLoading: boolean;
  chatHistory: { role: string; content: string }[];
  currentSpaceId?: string;
  hasSources?: boolean;
}

function ChatInput({
  onSend,
  onStop,
  isActionLoading,
  chatHistory,
  currentSpaceId,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = useCallback(async () => {
    const message = input.trim();
    if (!message || !currentSpaceId) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "24px";
    await onSend(message);
  }, [input, currentSpaceId, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      if (e.target) {
        e.target.style.height = "auto";
        e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
      }
    },
    []
  );

  return (
    <div className="flex flex-col gap-3 relative pb-4 px-4 shrink-0">
      <div className="flex items-center gap-3 bg-neutral-100 dark:bg-neutral-800/80 rounded-full px-2 py-2 ring-1 ring-border/50">
        <button className="text-text-secondary hover:text-text transition-colors">
          <Paperclip className="h-5 w-5" />
        </button>
        <textarea
          ref={textareaRef}
          className="bg-transparent flex-1 text-sm focus:outline-none resize-none min-h-[24px] max-h-[150px] leading-relaxed text-text placeholder-text-secondary custom-scrollbar"
          placeholder="Ask Thinkly anything..."
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        {isActionLoading ? (
          <button
            onClick={onStop}
            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2.5 transition-all flex items-center justify-center"
          >
            <Square className="h-4 w-4 fill-current" />
          </button>
        ) : (
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || !currentSpaceId}
            className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-2.5 transition-all flex items-center justify-center"
          >
            <SendIcon className="h-4 w-4 ml-0.5" />
          </button>
        )}
      </div>

      {chatHistory.length === 0 && !isActionLoading && currentSpaceId && (
        <div className="absolute bottom-full left-0 w-full mb-4 px-4">
          <ChatSuggestions chatWithSpace={(message) => onSend(message)} />
        </div>
      )}
    </div>
  );
}

export default React.memo(ChatInput);
