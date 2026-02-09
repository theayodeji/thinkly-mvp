import React, { useEffect } from "react";
import { useNoteStore } from "../../store/noteStore";
import { useQuizStore } from "../../store/quizStore";
import { Note } from "../../shared/types/note";
import toast from "react-hot-toast";
import QuizPreview from "./QuizPreview";
import QuizScore from "./QuizScore";
import QuizBox from "./QuizBox";
import QuizReview from "./QuizReview";

interface QuizContainerProps {
  onClose?: () => void;
}

const QuizContainer = ({ onClose }: QuizContainerProps) => {
  const getQuiz = useQuizStore((s) => s.getQuiz);
  const resetQuiz = useQuizStore((s) => s.resetQuiz);
  const status = useQuizStore((s) => s.status);
  const score = useQuizStore((s) => s.score);
  const currentNote = useNoteStore((s) => s.currentNote);
  const quizAnswers = useQuizStore((s) => s.quizAnswers);

  useEffect(() => {
    if (currentNote?.quiz) {
      const res = getQuiz(currentNote.quiz);
      if (!res) {
        toast.error("Failed to fetch quiz");
      }
    }
    return () => {
      resetQuiz();
    };
  }, [currentNote?.quiz, getQuiz, resetQuiz]);

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
