import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { cn } from '../../shared/utils/cn';
import { Bot } from 'lucide-react';

interface ChatMessageProps {
  message: {
    content: string;
    role: 'user' | 'assistant';
  };
  isStreaming?: boolean;
  streamedText?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isStreaming = false,
  streamedText = '',
}) => {
  const { content, role } = message;
  const isUser = role === 'user';

  const thinkingMessage = React.useMemo(() => {
    const messages = [
      "Thinking",
      "Analyzing notes",
      "Connecting the dots",
      "Digging into sources",
      "Formulating response",
      "Scanning the space"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }, []);

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start gap-2")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0 mt-1">
          <Bot className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
      )}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 10 }}
        animate={{ 
          scale: 1, 
          opacity: 1, 
          y: 0,
          transition: {
            type: 'spring',
            stiffness: 200,
            damping: 20
          }
        }}
        className={cn(`prose prose-neutral max-w-[85%] px-3 py-2 rounded-lg text-sm text-wrap`, {
          'bg-primary-500 text-white self-end origin-right': isUser,
          'bg-bg text-text self-start origin-left max-w-[95%]': !isUser,
        })}
      >
        {isStreaming && !isUser && !streamedText ? (
          <div className="flex items-center gap-1.5 h-5 text-text-secondary px-1">
            <span className="text-sm font-medium animate-pulse">{thinkingMessage}</span>
            <div className="flex gap-1 mt-1">
              <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        ) : (
          <ReactMarkdown
            components={{
              strong: ({ ...props }) => (
                <strong className="font-bold text-primary-500 dark:text-secondary-400 text-md" {...props} />
              ),
              li: ({ ...props }) => (
                <li className="list-disc ml-6" {...props} />
              ),
            }}
          >
            {isStreaming && !isUser ? streamedText : content}
          </ReactMarkdown>
        )}
      </motion.div>
    </div>
  );
};

export default ChatMessage;
