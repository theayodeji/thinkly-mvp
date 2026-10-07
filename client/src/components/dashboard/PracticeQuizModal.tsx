import React, { useState, useEffect } from "react";
import {
  X,
  FileQuestion,
  CheckCircle2,
  XCircle,
  Home,
  FileText,
  RotateCcw,
  ChevronRight,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Button } from "../ui/Button";
import { AnimatePresence, motion } from "framer-motion";
import { useSpaces, useCreateSpace } from "../../hooks/queries/useSpaces";
import { ISpace } from "@thinkly/shared";
import { useNavigate } from "react-router-dom";

interface PracticeQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const mockQuestionsForSpace = (spaceTitle: string): QuizQuestion[] => [
  {
    id: 1,
    question: `What is the core theme of "${spaceTitle}"?`,
    options: [
      "Understanding fundamental concepts and key principles",
      "Memorizing raw statistics without context",
      "Comparing historical dates and timelines",
      "Calculating advanced mathematical formulas",
    ],
    correctAnswer: 0,
    explanation:
      "Core study materials focus primarily on fundamental concepts and structural understanding.",
  },
  {
    id: 2,
    question: "Which studying technique is most effective for active recall in this space?",
    options: [
      "Passive re-reading of notes",
      "Flashcards and self-testing quizzes",
      "Highlighting long paragraphs",
      "Copying text verbatim",
    ],
    correctAnswer: 1,
    explanation:
      "Active recall via flashcards and regular quizzing produces superior long-term retention.",
  },
  {
    id: 3,
    question: "How does organizing notes into structured spaces improve learning?",
    options: [
      "It reduces cognitive load and enhances retrieval paths",
      "It automatically completes assignments for you",
      "It replaces the need for practice exams",
      "It guarantees 100% test scores without studying",
    ],
    correctAnswer: 0,
    explanation:
      "Categorizing materials into dedicated spaces streamlines cognitive processing and active retrieval.",
  },
  {
    id: 4,
    question: "What is the primary benefit of testing yourself before an exam?",
    options: [
      "Identifying knowledge gaps and reinforcing weak topics",
      "Predicting exact exam questions word for word",
      "Skipping reading assignments",
      "Accelerating typing speed",
    ],
    correctAnswer: 0,
    explanation:
      "Pre-exam testing pinpoints gaps in knowledge while strengthening synaptic memory connections.",
  },
  {
    id: 5,
    question: "How should you approach complex topics in your study notes?",
    options: [
      "Break them down into smaller digestible learning paths",
      "Memorize the longest definitions first",
      "Skip hard sections entirely",
      "Rely solely on last-minute cramming",
    ],
    correctAnswer: 0,
    explanation:
      "Chunking complex topics into small learning modules builds foundational mastery step by step.",
  },
];

const PracticeQuizModal: React.FC<PracticeQuizModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { data: spaces, isLoading: isLoadingSpaces } = useSpaces();
  const { mutateAsync: createSpace } = useCreateSpace();

  const [step, setStep] = useState<"select" | "prompt" | "taking" | "completed">("select");
  const [selectedSpace, setSelectedSpace] = useState<ISpace | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showReview, setShowReview] = useState<boolean>(false);
  const [isCreatingSpace, setIsCreatingSpace] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleResetAndClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleResetAndClose = () => {
    setStep("select");
    setSelectedSpace(null);
    setQuestions([]);
    setCurrentQIndex(0);
    setUserAnswers({});
    setShowReview(false);
    onClose();
  };

  const handleSelectSpace = (space: ISpace) => {
    setSelectedSpace(space);
    setStep("prompt");
  };

  const handleCreateNewSpace = async () => {
    try {
      setIsCreatingSpace(true);
      const newSpace = await createSpace();
      setSelectedSpace(newSpace);
      setStep("prompt");
    } catch (err) {
      console.error("Failed to create space for quiz:", err);
    } finally {
      setIsCreatingSpace(false);
    }
  };

  const handleStartQuiz = () => {
    if (!selectedSpace) return;
    const generated = mockQuestionsForSpace(selectedSpace.title || "Untitled Space");
    setQuestions(generated);
    setCurrentQIndex(0);
    setUserAnswers({});
    setStep("taking");
  };

  const handleSelectOption = (qIndex: number, optionIndex: number) => {
    setUserAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleNextOrSubmit = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      setStep("completed");
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const score = calculateScore();
  const percentage = Math.round((score / (questions.length || 1)) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleResetAndClose}
          className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs min-h-[100dvh] w-screen"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden bg-white dark:bg-slate-900 rounded-2xl shadow-2xl relative max-h-[90vh] flex flex-col border border-white/10"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-text/10 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 flex-shrink-0">
              <div className="flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-primary-500" />
                <h3 className="font-bold text-base sm:text-lg text-text">
                  {step === "select" && "Select a Space for Practice Quiz"}
                  {step === "prompt" && `Practice Quiz: ${selectedSpace?.title || "Space"}`}
                  {step === "taking" && `Quiz in Progress (${currentQIndex + 1}/${questions.length})`}
                  {step === "completed" && "Quiz Results"}
                </h3>
              </div>
              <button
                onClick={handleResetAndClose}
                aria-label="Close modal"
                className="p-1.5 text-text-secondary hover:text-text hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              {/* STEP 1: Select Space */}
              {step === "select" && (
                <div className="space-y-4">
                  <p className="text-xs sm:text-sm text-text-secondary">
                    Choose one of your study spaces to generate a practice quiz from:
                  </p>

                  {isLoadingSpaces ? (
                    <div className="py-8 text-center text-sm text-text-secondary">
                      Loading your spaces...
                    </div>
                  ) : spaces && spaces.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                      {spaces.map((space) => (
                        <button
                          key={space._id}
                          onClick={() => handleSelectSpace(space)}
                          className="w-full flex items-center justify-between p-3.5 rounded-xl border border-text/10 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-primary-500/10 hover:border-primary-500/30 transition-all text-left group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary-500/10 text-primary-500 flex items-center justify-center font-bold">
                              <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-text group-hover:text-primary-500 transition-colors">
                                {space.title || "Untitled Space"}
                              </h4>
                              <p className="text-xs text-text-secondary">
                                {space.updatedAt
                                  ? `Updated ${new Date(space.updatedAt).toLocaleDateString()}`
                                  : "Study Space"}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center space-y-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-text/10">
                      <p className="text-sm font-semibold text-text">No spaces found yet!</p>
                      <p className="text-xs text-text-secondary">
                        Create a space first to generate custom practice quizzes.
                      </p>
                      <Button
                        onClick={handleCreateNewSpace}
                        loading={isCreatingSpace}
                        disabled={isCreatingSpace}
                        className="btn-3d-primary py-2 px-4 text-xs font-bold rounded-lg"
                      >
                        Create a Space First
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: Prompt to Start Quiz */}
              {step === "prompt" && selectedSpace && (
                <div className="space-y-6 text-center py-2">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-100 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-primary-500 flex items-center justify-center shadow-inner">
                    <Sparkles className="w-8 h-8 stroke-[1.75]" />
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-text">
                      Ready to test your knowledge on &quot;{selectedSpace.title}&quot;?
                    </h4>
                    <p className="text-xs sm:text-sm text-text-secondary mt-1.5 max-w-sm mx-auto">
                      Thinkly will generate 5 practice questions to evaluate your recall and topic comprehension.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-text/10 text-xs font-semibold text-text-secondary flex justify-around">
                    <span>5 Questions</span>
                    <span>•</span>
                    <span>~3 Min Duration</span>
                    <span>•</span>
                    <span>Multiple Choice</span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="neutral"
                      onClick={() => setStep("select")}
                      className="w-1/3 glass-panel py-2.5 text-sm font-semibold rounded-xl border border-text/10"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleStartQuiz}
                      className="w-2/3 btn-3d-primary py-2.5 text-sm font-bold rounded-xl"
                    >
                      ⚡ Start Quiz
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3: Taking Quiz */}
              {step === "taking" && questions.length > 0 && (
                <div className="space-y-5">
                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-text-secondary">
                      <span>Question {currentQIndex + 1} of {questions.length}</span>
                      <span>{Math.round(((currentQIndex + 1) / questions.length) * 100)}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 transition-all duration-300"
                        style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question Title */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-text/10">
                    <h4 className="text-base font-bold text-text leading-snug">
                      {questions[currentQIndex].question}
                    </h4>
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {questions[currentQIndex].options.map((opt, optIdx) => {
                      const isSelected = userAnswers[currentQIndex] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(currentQIndex, optIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-sm font-medium transition-all flex items-center gap-3 ${
                            isSelected
                              ? "border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-300 font-bold shadow-xs"
                              : "border-text/10 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800 text-text"
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                              isSelected
                                ? "bg-primary-500 text-white"
                                : "bg-slate-200 dark:bg-slate-700 text-text-secondary"
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Next / Submit */}
                  <div className="pt-2">
                    <Button
                      onClick={handleNextOrSubmit}
                      disabled={userAnswers[currentQIndex] === undefined}
                      className="w-full btn-3d-primary py-2.5 text-sm font-bold rounded-xl"
                    >
                      {currentQIndex < questions.length - 1 ? "Next Question →" : "Submit Quiz Result"}
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 4: Completed Screen */}
              {step === "completed" && (
                <div className="space-y-5 py-1">
                  {/* Score Header */}
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-500 mb-1">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h4 className="text-2xl font-extrabold text-text">Quiz Complete!</h4>
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-300 font-black text-lg">
                      Score: {score} / {questions.length} ({percentage}%)
                    </div>
                  </div>

                  {/* Review Answers Container (toggled via Review button) */}
                  {showReview && (
                    <div className="max-h-[220px] overflow-y-auto space-y-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-text/10 text-xs">
                      <h5 className="font-bold text-text mb-2">Answer Breakdown:</h5>
                      {questions.map((q, idx) => {
                        const userChoice = userAnswers[idx];
                        const isCorrect = userChoice === q.correctAnswer;
                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg border ${
                              isCorrect
                                ? "border-emerald-500/30 bg-emerald-500/5"
                                : "border-red-500/30 bg-red-500/5"
                            }`}
                          >
                            <div className="flex items-start gap-2 font-semibold text-text mb-1">
                              {isCorrect ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                              )}
                              <span>
                                Q{idx + 1}: {q.question}
                              </span>
                            </div>
                            <p className="text-text-secondary pl-6">
                              Your Answer:{" "}
                              <span className="font-bold text-text">
                                {userChoice !== undefined ? q.options[userChoice] : "None"}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p className="text-emerald-600 dark:text-emerald-400 pl-6 mt-0.5 font-medium">
                                Correct Answer: {q.options[q.correctAnswer]}
                              </p>
                            )}
                            <p className="text-text-secondary pl-6 mt-1 italic opacity-90">
                              Note: {q.explanation}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Action Buttons requested by USER:
                      1. Review Link (as always)
                      2. Go Home Link (separate)
                      3. Go to Note's Page Link
                  */}
                  <div className="space-y-2.5 pt-1">
                    <Button
                      variant="neutral"
                      onClick={() => setShowReview(!showReview)}
                      className="w-full glass-panel py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 rounded-xl border border-text/10"
                    >
                      <RotateCcw className="w-4 h-4 text-primary-500" />
                      {showReview ? "Hide Review" : "Review Answers"}
                    </Button>

                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Go Home Link */}
                      <Button
                        variant="neutral"
                        onClick={() => {
                          handleResetAndClose();
                          navigate("/dashboard");
                        }}
                        className="glass-panel py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 rounded-xl border border-text/10 text-text"
                      >
                        <Home className="w-4 h-4 text-primary-500" />
                        Go Home
                      </Button>

                      {/* Go to Note's Page Link */}
                      <Button
                        onClick={() => {
                          const spaceId = selectedSpace?._id;
                          handleResetAndClose();
                          if (spaceId) {
                            navigate(`/spaces/${spaceId}`);
                          } else {
                            navigate("/spaces");
                          }
                        }}
                        className="btn-3d-primary py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 rounded-xl"
                      >
                        <FileText className="w-4 h-4" />
                        Go to Note&apos;s Page
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PracticeQuizModal;
