import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { cn } from '../../shared/utils/cn';

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

  return (
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
    </motion.div>
  );
};

export default ChatMessage;
