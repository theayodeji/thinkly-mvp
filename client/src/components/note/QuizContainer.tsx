import React, { useEffect } from "react";
import { useNoteStore } from "../../store/noteStore";
import QuizBox from "./QuizBox";
import { useQuizStore } from "../../store/quizStore";
import toast from "react-hot-toast";
import QuizPreview from "./QuizPreview";
import QuizScore from "./QuizScore";

const QuizContainer = () => {
  const { currentNote } = useNoteStore();
  const getQuiz = useQuizStore((s) => s.getQuiz);
  const resetQuiz = useQuizStore((s) => s.resetQuiz);
  const status = useQuizStore((s) => s.status);
  const score = useQuizStore((s) => s.score);

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
    <div className="flex flex-col items-center justify-center w-full">
      {status === "idle" && <QuizPreview />}
      {status === "started" && <QuizBox />}
      {status === "completed" && score && <QuizScore score={score}/>}
    </div>
  );
};

export default QuizContainer;
