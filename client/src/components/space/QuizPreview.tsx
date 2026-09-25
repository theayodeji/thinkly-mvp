//a component that shows the title of the Space with "quiz on " prefix, the nature of the quiz and a start button
import React from "react";
import { useParams } from "react-router-dom";
import { useSpace } from "../../hooks/queries/useSpaces";
import { Button } from "../ui/Button";
import { motion } from "framer-motion";
import { useQuizStore } from "../../store/quizStore";
// type Props = {}

const QuizPreview = () => {
  const { id } = useParams<{ id: string }>();
  const { data: currentSpace } = useSpace(id || "");
  const startQuiz = useQuizStore((s) => s.startQuiz);

  return (
    <div className="flex flex-col items-start justify-center">
      <h2 className="text-3xl font-bold">
        Quiz on{" "}
        <span className="font-bold text-primary-400 dark:text-secondary-400">
          {currentSpace?.title}
        </span>
      </h2>
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
        >
          <p>
            The quiz will last{" "}
            <span className="font-bold text-primary-400 dark:text-secondary-400">
              5 minutes
            </span>
          </p>
          <p>
            There will be{" "}
            <span className="font-bold text-primary-400 dark:text-secondary-400">
              15 questions
            </span>{" "}
            based on your Spaces
          </p>
          <p>
            Each question will have{" "}
            <span className="font-bold text-primary-400 dark:text-secondary-400">
              4 options
            </span>
            , and only one correct answer
          </p>
          <p>After the quiz is over, you will be shown your score</p>
          <br />
          <p className="text-lg font-bold">Good <span className="text-primary-400 dark:text-secondary-400">luck!</span></p>
        </motion.div>
      <Button className="self-end mt-4" onClick={startQuiz}>Start Quiz</Button>
    </div>
  );
};

export default QuizPreview;
