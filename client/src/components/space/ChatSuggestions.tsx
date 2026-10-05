import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import { useSpace } from "../../hooks/queries/useSpaces";

const SCROLL_AMOUNT = 200;

interface ChatSuggestionsProps {
  chatWithSpace: (message: string, id: string) => void;
}

const ChatSuggestions = ({
  chatWithSpace,
}: ChatSuggestionsProps) => {
  const { id: SpaceId } = useParams<{ id: string }>();
  const { data: currentSpace } = useSpace(SpaceId || "");
  const id = currentSpace?._id as string;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const questions = [
    "What are the main topics?",
    "Summarize this for me",
    "Quiz me on this space"
  ];

  return (
    <div className="w-full mb-4">
      <div className="flex flex-wrap gap-2 justify-center max-w-xl mx-auto">
        {questions.map((question) => (
          <button
            key={question}
            onClick={() => chatWithSpace(question, id)}
            className="glass-panel px-4 py-2 text-sm font-medium hover:border-primary-500/50 transition-colors"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatSuggestions;
