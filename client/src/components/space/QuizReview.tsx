import { useState } from "react";
import { IQuizQuestion } from "@thinkly/shared";
import { useQuizStore } from "../../store/quizStore";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "../ui/Button";

type Props = {
  quizAnswers: (IQuizQuestion | null)[];
  onClose?: () => void;
};

const QuizReview = ({ quizAnswers, onClose }: Props) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const answers = useQuizStore((s) => s.answers);

  if (!quizAnswers || quizAnswers.length === 0) {
    return <div>QuizReview Not Found</div>;
  }

  const currentQ = quizAnswers[currentQuestion];
  if (!currentQ) return <div>Question not found</div>;

  const userAnswer = answers[currentQuestion];
  // correctAnswer is the index number from the backend
  const correctAnswerIndex = currentQ.correctAnswer;

  const handleNext = () => {
    if (currentQuestion < quizAnswers.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="px-2 py-3 max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text">
          Question {currentQuestion + 1} of {quizAnswers.length}
        </h2>
      </div>

      <p className="text-lg font-medium mb-6 text-text">{currentQ.question}</p>

      <div className="space-y-3 mb-6">
        {currentQ.options.map((option, index) => {
          const isCorrect = index === correctAnswerIndex;
          const isUserAnswer = index === userAnswer;
          const isWrongAnswer = isUserAnswer && !isCorrect;

          return (
            <div
              key={index}
              className={`relative flex items-center p-4 rounded-lg border-2 transition-colors ${
                isCorrect
                  ? "border-secondary-500 bg-secondary-500/10"
                  : isWrongAnswer
                  ? "border-danger bg-danger/10"
                  : "border-border bg-bg-secondary"
              }`}
            >
              <div className="flex items-center w-full">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mr-3 ${
                    isCorrect
                      ? "border-secondary-500 bg-secondary-500"
                      : isWrongAnswer
                      ? "border-danger bg-danger"
                      : "border-neutral"
                  }`}
                >
                  {isCorrect && <CheckCircle className="w-4 h-4 text-white" />}
                  {isWrongAnswer && <XCircle className="w-4 h-4 text-white" />}
                </div>
                <span className="text-text flex-1">{option}</span>
              </div>
            </div>
          );
        })}
      </div>

      {currentQ.explanation && (
        <div className="mb-6 p-4 bg-primary-500/10 border-l-4 border-primary-500 rounded">
          <h3 className="font-semibold text-primary-600 mb-2">Explanation:</h3>
          <p className="text-text-secondary">{currentQ.explanation}</p>
        </div>
      )}

      <div className="flex justify-between">
        <Button
          onClick={handlePrev}
          disabled={currentQuestion === 0}
          variant="neutral"
        >
          Previous
        </Button>
        <div className="flex gap-2">
          {currentQuestion < quizAnswers.length - 1 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={onClose}>Close</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizReview;
