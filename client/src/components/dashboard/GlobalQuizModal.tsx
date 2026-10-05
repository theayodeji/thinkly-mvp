import React from "react";
import { X, Globe, Clock, Trophy, Medal } from "lucide-react";
import { Button } from "../ui/Button";
import { AnimatePresence, motion } from "framer-motion";

interface GlobalQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalQuizModal: React.FC<GlobalQuizModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 h-[100dvh] w-[100vw]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-lg overflow-hidden bg-white dark:bg-slate-900 rounded-2xl shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="relative h-32 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <Globe className="w-16 h-16 text-white/20 absolute right-4 bottom-[-10px] transform rotate-12" />
              <h2 className="text-3xl font-extrabold text-white text-center tracking-tight">
                Global Quiz Event
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-text">
                  Coming Soon! Get ready to test your knowledge.
                </p>
                <p className="text-sm text-text-secondary">
                  Join our weekly global event to compete with learners worldwide in various categories.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-primary-500/5 border border-primary-500/10">
                  <Clock className="w-6 h-6 text-primary-500 mb-2" />
                  <h4 className="font-semibold text-sm">Time Limit</h4>
                  <p className="text-xs text-text-secondary">Race against the clock in allotted time slots.</p>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-primary-500/5 border border-primary-500/10">
                  <Trophy className="w-6 h-6 text-primary-500 mb-2" />
                  <h4 className="font-semibold text-sm">Leaderboards</h4>
                  <p className="text-xs text-text-secondary">Rank high globally and show off your skills.</p>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-primary-500/5 border border-primary-500/10">
                  <Medal className="w-6 h-6 text-primary-500 mb-2" />
                  <h4 className="font-semibold text-sm">Earn Perks</h4>
                  <p className="text-xs text-text-secondary">Win exclusive rewards and profile badges.</p>
                </div>
              </div>
              
              <div className="pt-4">
                <Button
                  onClick={onClose}
                  className="w-full btn-3d-primary py-3"
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
