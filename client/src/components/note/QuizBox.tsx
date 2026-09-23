import { Radio, RadioGroup } from "@headlessui/react";
import { CheckCircle } from "lucide-react";
import { useQuizStore } from "../../store/quizStore";
import { Quiz } from "../../shared/types/quiz";
import { useEffect, useCallback } from "react";
import { useSubmitQuiz } from "../../hooks/queries/useQuiz";
import toast from "react-hot-toast";

const QuizBox = () => {
  const {
    quiz,
    currentQuestion,
    answers,
    submitAnswer,
    timeLeft,
    prevQuestion,
    setQuizResult,
    isLoading,
    nextQuestion,
    status,
    tick,
  } = useQuizStore();

  const { mutateAsync: submitQuizMutation, isPending: isSubmitting } = useSubmitQuiz();

  // Timer effect
  useEffect(() => {
    if (status !== "started") return;
    const interval = setInterval(() => tick(), 1000);
    return () => clearInterval(interval);
  }, [status, tick]);

  if (isLoading || !quiz) {
    return (
      <div className="w-4/5 max-w-md p-6 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-6 bg-gray-200 rounded w-5/6 mx-auto"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  const currentQ = quiz.questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];

  const handleAnswerSelect = (answerIndex: number) => {
    submitAnswer(answerIndex);
  };

  const handleSubmit = useCallback(async () => {
    if (!quiz) return;
    try {
      const res = await submitQuizMutation({ id: quiz._id, answers });
      setQuizResult(res.score, res.answers);
    } catch (error) {
      toast.error("Failed to submit quiz");
    }
  }, [quiz, answers, submitQuizMutation, setQuizResult]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft === 0 && status === "started" && !isSubmitting) {
      handleSubmit();
    }
  }, [timeLeft, status, isSubmitting, handleSubmit]);

  return (
    <div className="px-2 max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </h2>
        {timeLeft > 0 && (
          <div className="text-lg font-medium">
            Time Left: {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </div>
        )}
      </div>

      <p className="text-lg font-medium mb-6">{currentQ.question}</p>

      <RadioGroup
        value={selectedAnswer}
        onChange={handleAnswerSelect}
        className="space-y-3 mb-6"
      >
        {currentQ.options.map((option, index) => (
          <Radio
            key={index}
            value={index}
            className={({ checked }: { checked: boolean }) =>
              `relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                checked
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-blue-300"
              }`
            }
          >
            {({ checked }) => (
              <div className="flex items-center w-full">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mr-3 ${
                    checked
                      ? "border-primary-500 bg-primary-500"
                      : "border-gray-400"
                  }`}
                >
                  {checked && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <span className="text-text">{option}</span>
              </div>
            )}
          </Radio>
        ))}
      </RadioGroup>

      <div className="flex justify-end">
        <button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className={`px-4 py-2 rounded-lg bg-white text-dark mr-2`}
        >
          Previous
        </button>
        {currentQuestion < quiz.questions.length - 1 && (
          <button
            onClick={nextQuestion}
            disabled={selectedAnswer === null}
            className={`px-4 py-2 rounded-lg ${
              selectedAnswer === null
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-primary-500 text-white hover:bg-primary-600"
            }`}
          >
            Next
          </button>
        )}
        {currentQuestion === quiz.questions.length - 1 && (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null || isSubmitting}
            className={`px-4 py-2 rounded-lg ${
              selectedAnswer === null || isSubmitting
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gradient-primary text-white"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizBox;
