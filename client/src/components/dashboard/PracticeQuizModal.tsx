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
  HelpCircle,
  Clock,
} from "lucide-react";
import { Button } from "../ui/Button";
import { AnimatePresence, motion } from "framer-motion";
import { useSpaces, useCreateSpace } from "../../hooks/queries/useSpaces";
import { useGenerateQuiz } from "../../hooks/queries/useQuiz";
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
    question: `What is the primary core objective described in "${spaceTitle}"?`,
    options: [
      "Accelerating foundational comprehension through structured active recall",
      "Memorizing passive notes without conceptual synthesis",
      "Replacing interactive discussion with manual static outlines",
      "Skipping core concept reviews prior to final evaluations",
    ],
    correctAnswer: 0,
    explanation:
      "Active recall and structured questioning form the cornerstone of master study techniques.",
  },
  {
    id: 2,
    question: `Which methodology is recommended when reviewing complex sections of "${spaceTitle}"?`,
    options: [
      "Socratic self-querying and targeted flashcard practice",
      "Reading the text once without self-testing",
      "Ignoring unfamiliar terminology and formulas",
      "Delaying practice until the day of the exam",
    ],
    correctAnswer: 0,
    explanation:
      "Self-querying forces cognitive engagement, leading to significantly higher long-term retention.",
  },
  {
    id: 3,
    question: "Why is spaced practice superior to cramming for topic retention?",
    options: [
      "It strengthens neural retrieval pathways over time",
      "It requires less total effort and zero revision",
      "It eliminates the need for notes or reference materials",
      "It relies exclusively on short-term memory capacity",
    ],
    correctAnswer: 0,
    explanation:
      "Spacing study sessions reinforces memory consolidation and prevents rapid decay of learned facts.",
  },
  {
    id: 4,
    question: "When encountering a challenging concept, what is the best immediate next step?",
    options: [
      "Break the concept down into smaller sub-components and test each one",
      "Skip the section entirely and hope it is not tested",
      "Re-read the entire document from start to finish",
      "Copy the text verbatim without processing the underlying meaning",
    ],
    correctAnswer: 0,
    explanation:
      "Chunking complex topics into small learning modules builds foundational mastery step by step.",
  },
];

import { usePermissionsAndLimits, MeteredMetric } from "../../hooks/usePermissionsAndLimits";

const PracticeQuizModal: React.FC<PracticeQuizModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { data: spaces, isLoading: isLoadingSpaces } = useSpaces();
  const { mutateAsync: createSpace } = useCreateSpace();
  const { mutateAsync: generateQuiz } = useGenerateQuiz();

  const { getLimitStatus, triggerLimitModal } = usePermissionsAndLimits();
  const quizLimitStatus = getLimitStatus(MeteredMetric.QUIZZES);

  const [step, setStep] = useState<"select" | "prompt" | "taking" | "completed">("select");
  const [selectedSpace, setSelectedSpace] = useState<ISpace | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showReview, setShowReview] = useState<boolean>(false);
  const [isCreatingSpace, setIsCreatingSpace] = useState<boolean>(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);

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

  const handleStartQuiz = async () => {
    if (!selectedSpace) return;
    
    if (quizLimitStatus.isReached || quizLimitStatus.isLocked) {
      triggerLimitModal("You've reached your daily limit for AI Practice Quizzes.");
      handleResetAndClose();
      return;
    }

    try {
      setIsGeneratingQuiz(true);
      const result = await generateQuiz(selectedSpace._id);
      if (result?.quiz?.questions && result.quiz.questions.length > 0) {
        const formatted: QuizQuestion[] = result.quiz.questions.map((q: any, idx: number) => ({
          id: idx + 1,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || "Review the source notes for further details.",
        }));
        setQuestions(formatted);
      } else {
        setQuestions(mockQuestionsForSpace(selectedSpace.title || "Untitled Space"));
      }
      setCurrentQIndex(0);
      setUserAnswers({});
      setStep("taking");
    } catch (err: any) {
      if (err?.response?.status === 403) {
        triggerLimitModal(err.response.data.message || "Daily limit reached.");
        handleResetAndClose();
        return;
      }
      console.error("Quiz generation fallback:", err);
      setQuestions(mockQuestionsForSpace(selectedSpace.title || "Untitled Space"));
      setCurrentQIndex(0);
      setUserAnswers({});
      setStep("taking");
    } finally {
      setIsGeneratingQuiz(false);
    }
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
            className="w-full max-w-lg overflow-hidden bg-white dark:bg-slate-900 rounded-2xl shadow-2xl relative max-h-[90vh] flex flex-col border border-neutral-200 dark:border-slate-800"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between bg-neutral-50 dark:bg-slate-800/50 flex-shrink-0">
              <div className="flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-primary-500" />
                <h3 className="font-bold text-base sm:text-lg text-text-primary">
                  {step === "select" && "Select a Space for Practice Quiz"}
                  {step === "prompt" && `Practice Quiz: ${selectedSpace?.title || "Space"}`}
                  {step === "taking" && `Quiz in Progress (${currentQIndex + 1}/${questions.length})`}
                  {step === "completed" && "Quiz Results"}
                </h3>
              </div>
              <button
                onClick={handleResetAndClose}
                aria-label="Close modal"
                className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-slate-800 rounded-full transition-colors"
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
                          className="w-full flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-neutral-50/50 dark:bg-slate-800/40 hover:bg-primary-500/10 hover:border-primary-500/30 transition-all text-left group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary-500/10 text-primary-500 flex items-center justify-center font-bold">
                              <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-text-primary group-hover:text-primary-500 transition-colors">
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
                    <div className="p-6 text-center space-y-3 bg-neutral-50 dark:bg-slate-800/40 rounded-xl border border-border/50">
                      <p className="text-sm font-semibold text-text-primary">No spaces found yet!</p>
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
                <div className="space-y-5 py-1">
                  <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-slate-800/60 border border-neutral-200/80 dark:border-slate-700/80 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md bg-primary-100 text-primary-700 dark:bg-primary-950/80 dark:text-primary-300">
                        AI Practice Quiz
                      </span>
                    </div>

                    <h4 className="text-xl font-extrabold text-text-primary leading-snug">
                      Test your knowledge on &quot;{selectedSpace.title}&quot;
                    </h4>

                    <p className="text-xs text-text-secondary leading-relaxed">
                      Thinkly AI will analyze your space notes and generate targeted practice questions to evaluate your comprehension and topic mastery.
                    </p>
                  </div>

                  {/* Metadata Specs Grid */}
                  <div className="grid grid-cols-3 gap-2.5 text-left">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-neutral-200/80 dark:border-slate-800 flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-primary-500 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-text-primary">Questions</div>
                        <div className="text-[11px] text-text-secondary font-medium">5 Items</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-neutral-200/80 dark:border-slate-800 flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-primary-500 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-text-primary">Duration</div>
                        <div className="text-[11px] text-text-secondary font-medium">~3 Mins</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-neutral-200/80 dark:border-slate-800 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-text-primary">Format</div>
                        <div className="text-[11px] text-text-secondary font-medium">Multiple Choice</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setStep("select")}
                      disabled={isGeneratingQuiz}
                      className="w-1/3 py-3 text-xs font-semibold rounded-xl border-border"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleStartQuiz}
                      loading={isGeneratingQuiz}
                      disabled={isGeneratingQuiz}
                      className="w-2/3 btn-3d-primary py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      {isGeneratingQuiz ? "Generating AI Quiz..." : "Start Practice Quiz"}
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
                  <div className="p-4 rounded-xl bg-neutral-50 dark:bg-slate-800/50 border border-border/50">
                    <h4 className="text-base font-bold text-text-primary leading-snug">
                      {questions[currentQIndex].question}
                    </h4>
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {questions[currentQIndex].options.map((opt, optionIdx) => {
                      const isSelected = userAnswers[currentQIndex] === optionIdx;
                      return (
                        <button
                          key={optionIdx}
                          onClick={() => handleSelectOption(currentQIndex, optionIdx)}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between text-sm ${
                            isSelected
                              ? "bg-primary-500/10 border-primary-500 text-primary-600 dark:text-primary-400 font-semibold shadow-xs"
                              : "bg-white dark:bg-slate-800/40 border-border/60 text-text-primary hover:border-primary-500/50"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                isSelected
                                  ? "bg-primary-500 text-white"
                                  : "bg-neutral-100 dark:bg-slate-700 text-text-secondary"
                              }`}
                            >
                              {String.fromCharCode(65 + optionIdx)}
                            </span>
                            <span>{opt}</span>
                          </span>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Action Bar */}
                  <div className="flex justify-between items-center pt-3 border-t border-border/50">
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentQIndex === 0}
                      className="text-xs font-semibold"
                    >
                      Previous
                    </Button>

                    <Button
                      onClick={handleNextOrSubmit}
                      disabled={userAnswers[currentQIndex] === undefined}
                      className="btn-3d-primary py-2 px-5 text-xs font-bold rounded-lg"
                    >
                      {currentQIndex === questions.length - 1 ? "Submit Quiz" : "Next Question"}
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 4: Completed Quiz Results */}
              {step === "completed" && (
                <div className="space-y-6 text-center py-2">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary-500/10 text-primary-500 flex items-center justify-center">
                    <Sparkles className="w-8 h-8" />
                  </div>

                  <div>
                    <h4 className="text-xl font-extrabold text-text-primary">Quiz Completed!</h4>
                    <p className="text-xs text-text-secondary mt-1">
                      Here is your performance summary for &quot;{selectedSpace?.title}&quot;
                    </p>
                  </div>

                  {/* Score Card */}
                  <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-slate-800/60 border border-border/50 max-w-xs mx-auto space-y-1">
                    <div className="text-4xl font-black text-primary-500">{percentage}%</div>
                    <div className="text-xs font-semibold text-text-secondary">
                      You scored {score} out of {questions.length} correct
                    </div>
                  </div>

                  {/* Review Accordion / Toggle */}
                  <div>
                    <Button
                      variant="ghost"
                      onClick={() => setShowReview(!showReview)}
                      className="text-xs font-semibold text-primary-500 hover:text-primary-600"
                    >
                      {showReview ? "Hide Question Breakdown" : "Review Question Breakdown"}
                    </Button>

                    {showReview && (
                      <div className="mt-4 space-y-3 text-left max-h-[250px] overflow-y-auto pr-1">
                        {questions.map((q, idx) => {
                          const isCorrect = userAnswers[idx] === q.correctAnswer;
                          return (
                            <div
                              key={idx}
                              className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                                isCorrect
                                  ? "bg-green-500/5 border-green-500/20"
                                  : "bg-red-500/5 border-red-500/20"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-bold text-text-primary">
                                  {idx + 1}. {q.question}
                                </span>
                                {isCorrect ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                                )}
                              </div>

                              <div className="text-text-secondary">
                                <div>Your Answer: {q.options[userAnswers[idx]] || "None"}</div>
                                {!isCorrect && (
                                  <div className="text-green-600 dark:text-green-400 font-semibold">
                                    Correct: {q.options[q.correctAnswer]}
                                  </div>
                                )}
                              </div>

                              <div className="text-[11px] text-text-secondary italic bg-black/5 dark:bg-white/5 p-2 rounded-lg">
                                {q.explanation}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setStep("prompt")}
                      className="w-1/2 py-2.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 border-border"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Retake Quiz
                    </Button>
                    <Button
                      onClick={() => {
                        handleResetAndClose();
                        if (selectedSpace) navigate(`/spaces/${selectedSpace._id}`);
                      }}
                      className="w-1/2 btn-3d-primary py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <BookOpen className="w-4 h-4" />
                      Go to Space
                    </Button>
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
