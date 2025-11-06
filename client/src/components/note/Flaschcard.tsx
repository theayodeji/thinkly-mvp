import { cn } from "../../shared/utils/cn";

type FlashcardProps = {
    question: string;
    answer: string;
    isFlipped?: boolean;
};

const Flaschcard = ({question, answer, isFlipped}: FlashcardProps) => {

  return (
    <div
      className={cn(
        "w-full max-w-3xl h-80 sm:h-96 perspective-1000 cursor-pointer group",
        isFlipped ? "is-flipped" : ""
      )}
      id="flashcard"
    >
      <div className="relative w-full h-full flashcard-inner">
        <div className="absolute w-full h-full flashcard-front flex flex-col items-center justify-center p-6 sm:p-8 text-center bg-bg-secondary rounded-xl shadow-lg">
          <span className="absolute top-4 left-4 text-xs font-semibold text-gray-400 dark:text-gray-500">
            QUESTION
          </span>
          <p className="text-2xl sm:text-3xl font-bold text-text dark:text-gray-100">
            {question}
          </p>
        </div>
        <div className="absolute w-full h-full flashcard-back flex flex-col items-center justify-center p-6 sm:p-8 text-center bg-bg-secondary rounded-xl shadow-lg">
          <span className="absolute top-4 left-4 text-xs font-semibold text-primary">
            ANSWER
          </span>
          <p className="text-lg sm:text-xl text-text dark:text-gray-300 leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Flaschcard;
