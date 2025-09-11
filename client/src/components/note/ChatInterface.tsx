import { useRef, useState } from "react";
import { Button } from "../ui/Button";
import { SendIcon } from "lucide-react";
import SummaryBlock from "./SummaryBlock";
import { useNoteStore } from "../../store/noteStore";

export default function Chat() {

  const { currentNote,isChatLoading, chatWithNote, chatHistory } = useNoteStore();
  const [input, setInput] = useState("");
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const message = input.trim();
    setInput("");
    
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
    
    chatWithNote(currentNote?._id as string, message).then(() => {
      setTimeout(() => {
        chatBoxRef.current?.scrollTo({
          top: chatBoxRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 0);
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* <div className="p-4"></div> */}

      {/* Messages */}
      <div ref={chatBoxRef} className="flex-1 flex flex-col overflow-y-auto p-4 space-y-3">
        <SummaryBlock />
        {chatHistory.map((msg) => (
          <pre
            key={msg.content}
            className={`max-w-[90%] px-3 py-2 rounded-lg text-sm text-wrap ${
              msg.role === "user"
                ? "bg-primary-500 text-white self-end"
                : "bg-white text-gray-800 self-start"
            }`}
          >
            {msg.content}
          </pre>
        ))}
        {isChatLoading && (
          <div className="max-w-[80%] px-3 py-2 rounded-lg text-sm text-wrap bg-white text-gray-800 self-start">
            {/* three circle bounce animation with delay*/}
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce animate-delay-100"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce animate-delay-200"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="rounded-b-lg border-1 border-neutral-300 sm:px-4 sm:py-4 px-2 py-2 flex items-end gap-2">
        <textarea
          className="bg-white flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-100 resize-none min-h-[36px] max-h-[150px] leading-tight"
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
      </div>
    </div>
  );
}
