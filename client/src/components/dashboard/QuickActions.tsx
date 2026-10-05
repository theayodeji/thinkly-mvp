import React, { useState } from "react";
import { FilePlus, Globe, FileQuestion, Timer, X, Trophy, Clock, Medal } from "lucide-react";
import { Button } from "../ui/Button";
import { useCreateSpace } from "../../hooks/queries/useSpaces";
import { useNavigate } from "react-router-dom";
import GlobalQuizModal from "./GlobalQuizModal";

const QuickActions = () => {
  const { mutateAsync: createSpace } = useCreateSpace();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);

  const handleCreateSpace = async () => {
    setIsCreating(true);
    try {
      const newSpace = await createSpace();
      navigate(`/spaces/${newSpace._id}`);
    } catch (error) {
      console.error("Failed to create Space:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Button
          onClick={handleCreateSpace}
          loading={isCreating}
          className="flex flex-col items-center justify-center gap-3 h-32 btn-3d-primary w-full"
        >
          <FilePlus className="h-7 w-7" />
          <span className="font-semibold text-sm">Create Space</span>
        </Button>
        <button
          onClick={() => setShowQuizModal(true)}
          className="flex flex-col items-center justify-center gap-3 h-32 glass-panel border border-white/50 dark:border-white/10 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 w-full group relative overflow-hidden"
        >
          <div className="absolute top-2 right-2 bg-gradient-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            Soon
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400/20 to-primary-600/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
            <Globe className="h-6 w-6 text-primary-500 dark:text-primary-400" />
          </div>
          <span className="font-semibold text-sm text-text">Global Quiz</span>
        </button>
        <button
          className="flex flex-col items-center justify-center gap-3 h-32 glass-panel border border-white/50 dark:border-white/10 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 w-full group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400/20 to-primary-600/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
            <FileQuestion className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <span className="font-semibold text-sm text-text">Practice Quiz</span>
        </button>
        <button
          className="flex flex-col items-center justify-center gap-3 h-32 glass-panel border border-white/50 dark:border-white/10 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 w-full group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400/20 to-primary-600/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
            <Timer className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <span className="font-semibold text-sm text-text">Pomodoro</span>
        </button>
      </div>

      <GlobalQuizModal 
        isOpen={showQuizModal} 
        onClose={() => setShowQuizModal(false)} 
      />
    </>
  );
};

export default QuickActions;
