import React from "react";
import { useQuizStore } from "../../store/quizStore";
import { useClose } from "@headlessui/react";
import { Button } from "../ui/Button";

type Props = { score: number };

const QuizScore = ({ score }: Props) => {
  const close = useClose();

  const quiz = useQuizStore((s) => s.quiz);

  if (!score) return <h2>Something went wrong</h2>;

  if (score < 8) {
    return (
      <div className="flex flex-col items-center justify-center">
        <img
          src="/crash-fail.gif"
          alt=""
          className="rounded-md shadow-md mb-4"
        />
        <h2 className="text-5xl font-bold mb-3">
          You can do <span className="text-primary-500">better</span>😢
        </h2>
        <p className="text-xl mb-3">
          You scored {score} out of {quiz?.questions.length}
        </p>
        <Button onClick={close}>Close</Button>
      </div>
    );
  }

  if (score >= 8)
    return (
      <div className="flex flex-col items-center justify-center">
        <img
          src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWRwdHg2ODBteHdtNmlkbG85MTQzZ2tqczdrZms0OG8xdWNtc21iaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/O3eltvqy7SIQU/giphy.gif"
          alt=""
          className="rounded-md shadow-md mb-4"
        />
        <h2 className="text-5xl font-bold mb-3">
          You did <span className="text-primary-500">great!</span>🎉
        </h2>
        <p className="text-xl mb-3">
          You scored {score} out of {quiz?.questions.length}
        </p>
        <Button onClick={close}>Close</Button>
      </div>
    );
  if (score == 15)
    return (
      <div className="flex flex-col items-center justify-center">
        <img
          src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3djh6NTl0OW8zdGszdXRqbmVicXR3bjg2Z2pwOGZtMGFxMDEwbGkyeiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/K5YC2HXUjUPjDM3kjj/giphy.gif"
          alt=""
          className="rounded-md shadow-md mb-4"
        />
        <h2 className="text-5xl font-bold mb-3">
          You got a <span className="text-primary-500">PERFECT SCORE!!!</span>💯
        </h2>
        <p className="text-xl mb-3">
          You scored {score} out of {quiz?.questions.length}
        </p>
        <Button onClick={close}>Close</Button>
      </div>
    );
};

export default QuizScore;
