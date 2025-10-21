import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "../ui/Button";
import { SendIcon } from "lucide-react";
import ChatSuggestions from "./ChatSuggestions";
import { useNoteStore } from "../../store/noteStore";

interface ChatInputProps {
  onSend: (message: string) => void;
  isActionLoading: boolean;
  chatHistory: { role: string; content: string }[];
  currentNoteId?: string;
}

function ChatInput({
  onSend,
  isActionLoading,
  chatHistory,
  currentNoteId,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { chatWithNote, currentNote } = useNoteStore();

  // Handle sending a message
  const handleSendMessage = useCallback(async () => {
    const message = input.trim();
    if (!message || !currentNoteId) return;

    // Notify parent component that a message was sent
    onSend(message);

    // Clear input and reset textarea height
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "36px";
    }

    // Handle the actual chat operation
    try {
      await chatWithNote(currentNoteId, message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [input, currentNoteId, onSend, chatWithNote]);

  // Handle keydown events for the textarea
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  // Handle textarea changes with auto-resize
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
    <div className="rounded-b-lg border-1 border-neutral-300 dark:border-neutral-700 sm:px-4 sm:py-4 px-2 py-2 flex items-end gap-2 relative">
      <textarea
        ref={textareaRef}
        className="bg-bg flex-1 rounded-lg border border-neutral-300 dark:border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-none focus:bg-bg/50 resize-none min-h-[36px] max-h-[150px] leading-tight transition-all duration-200"
        placeholder="Ask anything..."
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={1}
      />
      <Button
        variant="primary"
        size="sm"
        icon={<SendIcon className="h-4 w-4"/>}
        onClick={handleSendMessage}
        disabled={
          !input.trim() || !currentNoteId || currentNote?.sources?.length === 0
        }
      >
        Send
      </Button>
      {chatHistory.length === 0 && !isActionLoading && currentNoteId && (
        <ChatSuggestions
          chatWithNote={(message) => chatWithNote(currentNoteId, message)}
        />
      )}
    </div>
  );
}

export default React.memo(ChatInput);
