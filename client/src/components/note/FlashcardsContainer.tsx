import { useCallback, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Flaschcard from "./Flaschcard";
import { ArrowLeft, ArrowRight, Loader2, Repeat2 } from "lucide-react";
import { useNoteStore } from "../../store/noteStore";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: { opacity: 0 },
};

import type { Variants } from 'framer-motion';

const buttonVariants: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20
    }
  },
  hover: { 
    scale: 1.05,
    transition: { type: 'spring', stiffness: 400, damping: 10 }
  },
  tap: { 
    scale: 0.95,
    transition: { type: 'spring', stiffness: 400, damping: 10 }
  }
};

const FlashcardsContainer = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for forward, -1 for backward
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Get flashcards and loading state from the store
  const { currentNote, flashcards, isFlashcardsLoading, getFlashcards } = useNoteStore();
  
  // Fetch flashcards when the component mounts or when the currentNote changes
  useEffect(() => {
    if (currentNote?._id) {
      getFlashcards(currentNote._id);
    }
  }, [currentNote?._id, getFlashcards]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const changeCard = useCallback((newIndex: number) => {
    setCurrentIndex(newIndex);
    setIsFlipped(false);
  }, []);

  const nextCard = useCallback(() => {
    if (!flashcards || flashcards.length === 0) return;
    setDirection(1);
    changeCard((currentIndex + 1) % flashcards.length);
  }, [currentIndex, changeCard, flashcards]);

  const prevCard = useCallback(() => {
    if (!flashcards || flashcards.length === 0) return;
    setDirection(-1);
    changeCard((currentIndex - 1 + flashcards.length) % flashcards.length);
  }, [currentIndex, changeCard, flashcards]);

  const restart = useCallback(() => {
    setDirection(0);
    changeCard(0);
  }, [changeCard]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          prevCard();
          break;
        case "ArrowRight":
        case " ": // Space bar
          if (isFlipped) {
            nextCard();
          } else {
            handleFlip();
          }
          break;
        case "Enter":
          handleFlip();
          break;
        default:
          break;
      }
    };

    const container = containerRef.current;
    container?.addEventListener("keydown", handleKeyDown);

    return () => {
      container?.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleFlip, isFlipped, nextCard, prevCard]);

  // Focus the container on mount for keyboard events
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Show loading state
  if (isFlashcardsLoading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="mt-4 text-text">Generating flashcards...</p>
      </div>
    );
  }

  // Show empty state if no flashcards
  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
        <p className="text-text/70 mb-4">No flashcards available for this note.</p>
        <p className="text-sm text-text/50">Use the tools section to generate flashcards from your note content.</p>
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 lg:px-8 outline-none overflow-hidden"
      tabIndex={0}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="w-full max-w-3xl flex justify-between items-center mb-4">
        <motion.span
          className="text-lg font-semibold text-text"
          key={`counter-${currentIndex}`}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentIndex + 1} / {flashcards.length}
        </motion.span>

        <motion.button
          onClick={restart}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-primary rounded-lg shadow-sm text-white cursor-pointer hover:opacity-90 transition-opacity"
          aria-label="Restart flashcards"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Repeat2 className="w-5 h-5" />
          Restart
        </motion.button>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          initial={{ x: direction > 0 ? 300 : -300, opacity: 0, scale: 0.9 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: direction > 0 ? -300 : 300, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full flex justify-center"
        >
          <div onClick={handleFlip} className="w-full max-w-3xl mx-auto">
            <Flaschcard
              isFlipped={isFlipped}
              question={flashcards[currentIndex]?.question || "No question available"}
              answer={flashcards[currentIndex]?.answer || "No answer available"}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="flex items-center justify-center gap-4 mt-8"
        variants={containerVariants}
      >
        <motion.button
          onClick={prevCard}
          className="p-4 rounded-full bg-gradient-primary shadow-md cursor-pointer text-white hover:opacity-90 transition-opacity"
          aria-label="Previous card"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <ArrowLeft className="w-8 h-5" />
        </motion.button>

        <motion.button
          className="cursor-pointer px-8 py-4 font-semibold text-text bg-bg-secondary rounded-full shadow-lg hover:opacity-90 transition-opacity min-w-[140px] text-center"
          onClick={handleFlip}
          aria-label={isFlipped ? "Show question" : "Show answer"}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          {isFlipped ? "Show Question" : "Show Answer"}
        </motion.button>

        <motion.button
          onClick={nextCard}
          className="p-4 rounded-full bg-gradient-primary shadow-md cursor-pointer text-white hover:opacity-90 transition-opacity"
          aria-label="Next card"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <ArrowRight className="w-8 h-5" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default FlashcardsContainer;
