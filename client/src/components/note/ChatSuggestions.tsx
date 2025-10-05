import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNoteStore } from "../../store/noteStore";

const SCROLL_AMOUNT = 200;

const ChatSuggestions = ({
  chatWithNote,
}: {
  chatWithNote: (message: string, id: string) => void;
}) => {
  const { currentNote } = useNoteStore();
  const id = currentNote?._id as string;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const questions = currentNote?.chatSuggestions || [];

  const scroll = (scrollOffset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollLeft + scrollOffset,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[90%]">
      <button
        onClick={() => scroll(-SCROLL_AMOUNT)}
        className="absolute left-0 top-1/2 -translate-y-1/2 opacity-20 hover:opacity-100 transition-opacity duration-300 cursor-pointer -translate-x-6 bg-white/80 hover:bg-white text-gray-700 rounded-full p-1 shadow-md z-10"
        aria-label="Scroll left"
      >
        <ChevronLeft size={20} />
      </button>

      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto scroll-smooth snap-x scrollbar-hidden"
      >
        <div className="w-max text-xs flex gap-2 items-center justify-center py-1">
          <AnimatePresence>
            {(questions as string[]).map((question, i) => (
              <motion.div
                key={question}
                className="h-8 bg-gradient-primary border border-neutral-300 rounded-md text-white cursor-pointer flex items-center justify-start px-2 whitespace-nowrap snap-center hover:opacity-90 transition-all"
                onClick={() => chatWithNote(id, question)}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                  delay: i * 0.1,
                }}
                whileTap={{
                  scale: 0.95,
                  transition: { duration: 0.1 },
                }}
              >
                {question}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <button
        onClick={() => scroll(SCROLL_AMOUNT)}
        className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 hover:opacity-100 transition-opacity duration-300 cursor-pointer translate-x-6 bg-white/80 hover:bg-white text-gray-700 rounded-full p-1 shadow-md z-10"
        aria-label="Scroll right"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default ChatSuggestions;
