import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { motion } from "framer-motion";
import { cn } from "../../shared/utils/cn";
import { WandSparkles } from "lucide-react";
import { preprocessMath } from "../../shared/utils/math";

interface ChatMessageProps {
  message: {
    content: string;
    role: "user" | "assistant";
  };
  isStreaming?: boolean;
  streamedText?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isStreaming = false,
  streamedText = "",
}) => {
  const { content, role } = message;
  const isUser = role === "user";

  const rawText = isStreaming && !isUser ? streamedText : content;
  const processedText = React.useMemo(() => preprocessMath(rawText), [rawText]);

  const thinkingMessage = React.useMemo(() => {
    const messages = [
      "Thinking",
      "Analyzing notes",
      "Connecting the dots",
      "Digging into sources",
      "Formulating response",
      "Scanning the space",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }, []);

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start gap-2",
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center shrink-0 mt-1 shadow-md">
          <WandSparkles className="h-4 w-4 text-white" />
        </div>
      )}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 10 }}
        animate={{
          scale: 1,
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 200,
            damping: 20,
          },
        }}
        className={cn(`px-4 py-3 rounded-2xl text-sm text-wrap`, {
          "bg-primary-500 text-white self-end origin-right": isUser,
          "text-text self-start origin-left max-w-[92%] sm:max-w-[85%]":
            !isUser,
        })}
      >
        {isStreaming && !isUser && !streamedText ? (
          <div className="flex items-center gap-1.5 h-5 text-text-secondary px-1">
            <span className="text-sm font-medium animate-pulse">
              {thinkingMessage}
            </span>
            <div className="flex gap-1 mt-1">
              <div
                className="w-1 h-1 bg-current rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-1 h-1 bg-current rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-1 h-1 bg-current rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              isUser
                ? "text-white"
                : "prose prose-sm prose-neutral dark:prose-invert prose-primary max-w-none text-text/90",
            )}
          >
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={
                !isUser
                  ? {
                      strong: ({ ...props }) => (
                        <strong
                          className="font-semibold text-primary-600 dark:text-primary-300"
                          {...props}
                        />
                      ),
                      ul: ({ ...props }) => (
                        <ul
                          className="list-disc pl-4 sm:pl-5 space-y-1.5 my-2 text-text/90 marker:text-primary-500"
                          {...props}
                        />
                      ),
                      ol: ({ ...props }) => (
                        <ol
                          className="list-decimal pl-4 sm:pl-5 space-y-1.5 my-2 text-text/90 marker:text-primary-500 font-medium"
                          {...props}
                        />
                      ),
                      li: ({ ...props }) => (
                        <li
                          className="pl-0.5 sm:pl-1 leading-relaxed"
                          {...props}
                        />
                      ),
                      p: ({ ...props }) => (
                        <p
                          className="mb-3 last:mb-0 leading-relaxed"
                          {...props}
                        />
                      ),
                      h2: ({ ...props }) => (
                        <h2
                          className="text-lg font-bold mt-4 mb-2 text-text"
                          {...props}
                        />
                      ),
                      h3: ({ ...props }) => (
                        <h3
                          className="text-base font-bold mt-3 mb-2 text-text"
                          {...props}
                        />
                      ),
                      blockquote: ({ ...props }) => (
                        <blockquote
                          className="border-l-4 border-primary-500 pl-4 py-1 my-3 italic bg-neutral-100/50 dark:bg-neutral-800/30 rounded-r-lg text-text-secondary"
                          {...props}
                        />
                      ),
                    }
                  : undefined
              }
            >
              {processedText}
            </ReactMarkdown>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ChatMessage;
