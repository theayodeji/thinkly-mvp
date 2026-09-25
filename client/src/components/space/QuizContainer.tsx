import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSpace } from "../../hooks/queries/useSpaces";
import { useQuiz } from "../../hooks/queries/useQuiz";
import { useQuizStore } from "../../store/quizStore";
import { Space } from "../../shared/types/Space";
import toast from "react-hot-toast";
import QuizPreview from "./QuizPreview";
import QuizScore from "./QuizScore";
import QuizBox from "./QuizBox";
import QuizReview from "./QuizReview";

interface QuizContainerProps {
  onClose?: () => void;
}

const QuizContainer = ({ onClose }: QuizContainerProps) => {
  const { id } = useParams<{ id: string }>();
  const { data: currentSpace } = useSpace(id || "");
  const { data: quiz, isError } = useQuiz(id || "");
  
  const setQuiz = useQuizStore((s) => s.setQuiz);
  const resetQuiz = useQuizStore((s) => s.resetQuiz);
  const status = useQuizStore((s) => s.status);
  const score = useQuizStore((s) => s.score);
  const quizAnswers = useQuizStore((s) => s.quizAnswers);

  useEffect(() => {
    if (quiz) {
      setQuiz(quiz);
    }
    if (isError) {
      toast.error("Failed to fetch quiz");
    }
  }, [quiz, isError, setQuiz]);

  useEffect(() => {
    return () => {
      resetQuiz();
    };
  }, [resetQuiz]);

  return (
    <div className="overflow-y-auto flex flex-col items-center justify-center w-full">
      {status === "idle" && <QuizPreview />}
      {status === "started" && <QuizBox />}
      {status === "completed" && score !== undefined && (
        <QuizScore score={score} onClose={onClose} />
      )}
      {status === "review" && quizAnswers && (
        <QuizReview quizAnswers={quizAnswers} onClose={onClose} />
      )}
    </div>
  );
};

export default QuizContainer;
