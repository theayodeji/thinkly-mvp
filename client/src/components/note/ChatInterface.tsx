import { useState } from "react";
import { Button } from "../ui/Button";
import { SendIcon } from "lucide-react";
import SummaryBlock from "./SummaryBlock";

type Message = {
  id: number;
  sender: "user" | "ai";
  text: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: "Hi! I'm your study buddy. Ask me anything about this note.",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    // simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: "ai", text: "Got it 👍 Let me explain..." },
      ]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full">
      {/* <div className="p-4"></div> */}

      {/* Messages */}
      <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-3">
        <SummaryBlock />
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
              msg.sender === "user"
                ? "bg-primary-500 text-white self-end"
                : "bg-white text-gray-800 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
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
        >
          Send
        </Button>
      </div>
    </div>
  );
}
