import React, { useState } from "react";
import { FilePlus, Mic, FileQuestion, Timer } from "lucide-react";
import { Button } from "../ui/Button";
import { useCreateSpace } from "../../hooks/queries/useSpaces";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const { mutateAsync: createSpace } = useCreateSpace();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <Button
        onClick={handleCreateSpace}
        loading={isCreating}
        className="flex flex-col items-center justify-center gap-3 h-28 bg-gradient-primary hover:bg-primary-700 text-white rounded-xl shadow-sm border border-primary-800"
      >
        <FilePlus className="h-6 w-6" />
        <span className="font-semibold text-sm">Create Space</span>
      </Button>
      <Button
        variant="outline"
        className="flex flex-col items-center justify-center gap-3 h-28 rounded-xl shadow-sm"
      >
        <Mic className="h-6 w-6 text-primary-600 dark:text-primary-400" />
        <span className="font-semibold text-sm">Transcribe Tool</span>
      </Button>
      <Button
        variant="outline"
        className="flex flex-col items-center justify-center gap-3 h-28 rounded-xl shadow-sm"
      >
        <FileQuestion className="h-6 w-6 text-primary-600 dark:text-primary-400" />
        <span className="font-semibold text-sm">Start Quiz</span>
      </Button>
      <Button
        variant="outline"
        className="flex flex-col items-center justify-center gap-3 h-28 rounded-xl shadow-sm"
      >
        <Timer className="h-6 w-6 text-primary-600 dark:text-primary-400" />
        <span className="font-semibold text-sm">Start Pomodoro</span>
      </Button>
    </div>
  );
};

export default QuickActions;
