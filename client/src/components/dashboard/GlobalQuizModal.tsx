import React, { useEffect } from "react";
import { X, Globe, Clock, Trophy, Medal } from "lucide-react";
import { Button } from "../ui/Button";
import { AnimatePresence, motion } from "framer-motion";

interface GlobalQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalQuizModal: React.FC<GlobalQuizModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs min-h-[100dvh] w-screen"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md sm:max-w-lg overflow-hidden bg-white dark:bg-slate-900 rounded-2xl shadow-2xl relative max-h-[90vh] flex flex-col border border-white/10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-3 right-3 p-1.5 text-white/90 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors z-20"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Header Banner */}
            <div className="relative h-24 sm:h-28 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center px-6 overflow-hidden flex-shrink-0">
              <Globe className="w-20 h-20 text-white/15 absolute right-2 -bottom-2 transform rotate-12 pointer-events-none" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white text-center tracking-tight z-10">
                Global Quiz Event
              </h2>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
              <div className="text-center space-y-1">
                <p className="text-base sm:text-lg font-bold text-text">
                  Coming Soon! Get ready to test your knowledge.
                </p>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Join our weekly global event to compete with learners worldwide in various categories.
                </p>
              </div>

              {/* 3 Compact Feature Cards (3-column side-by-side even on mobile) */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
                <div className="flex flex-col items-center text-center p-2.5 sm:p-3 rounded-xl bg-primary-500/10 dark:bg-primary-500/15 border border-primary-500/20">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500 mb-1.5" />
                  <h4 className="font-bold text-xs sm:text-sm text-text">Time Limit</h4>
                  <p className="text-[10px] sm:text-xs text-text-secondary mt-0.5 leading-tight">
                    Race against the clock
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-2.5 sm:p-3 rounded-xl bg-primary-500/10 dark:bg-primary-500/15 border border-primary-500/20">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500 mb-1.5" />
                  <h4 className="font-bold text-xs sm:text-sm text-text">Leaderboards</h4>
                  <p className="text-[10px] sm:text-xs text-text-secondary mt-0.5 leading-tight">
                    Rank high globally
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-2.5 sm:p-3 rounded-xl bg-primary-500/10 dark:bg-primary-500/15 border border-primary-500/20">
                  <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500 mb-1.5" />
                  <h4 className="font-bold text-xs sm:text-sm text-text">Earn Perks</h4>
                  <p className="text-[10px] sm:text-xs text-text-secondary mt-0.5 leading-tight">
                    Win profile badges
                  </p>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="pt-2">
                <Button
                  onClick={onClose}
                  className="w-full btn-3d-primary py-2.5 sm:py-3 text-sm sm:text-base font-bold rounded-xl"
                >
                  Got it!
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalQuizModal;
