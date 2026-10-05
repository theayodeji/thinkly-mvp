import React from "react";
import { useQuizStore } from "../../store/quizStore";
import { Button } from "../ui/Button";

type Props = {
  score: number | undefined | null;
  onClose?: () => void;
};

const QuizScore = ({ score, onClose }: Props) => {
  const quiz = useQuizStore((s) => s.quiz);
  const reviewAnswers = useQuizStore((s) => s.reviewAnswers);

  if (!score && score !== 0) return <h2>Something went wrong</h2>;

  const total = quiz?.questions.length || 0;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const incorrect = total - score;

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
      <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-6">
        <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">{percentage}%</span>
      </div>
      
      <h2 className="text-3xl font-bold mb-2">
        Quiz Completed!
      </h2>
      
      <p className="text-lg text-text-secondary mb-8">
        You got {score} out of {total} correct
      </p>

      <div className="w-full glass-panel p-4 mb-8">
        <div className="flex justify-between items-center py-2 border-b border-border/50">
          <span className="font-medium text-text">Correct</span>
          <span className="font-bold text-emerald-500">{score}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="font-medium text-text">Incorrect</span>
          <span className="font-bold text-red-500">{incorrect}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {incorrect > 0 && (
          <Button onClick={reviewAnswers} className="btn-3d-primary w-full h-12 text-base">
            Study missed questions
          </Button>
        )}
        <Button onClick={onClose} variant="outline" className="w-full h-12 text-base">
          Close
        </Button>
      </div>
    </div>
  );
};

export default QuizScore;
