import QuizDrawer from "./QuizDrawer";
import QuizContainer from "./QuizContainer";
import Drawer from "../ui/Drawer";
import { ChartBarDecreasing, BadgeQuestionMark, Sparkles, Loader2 } from "lucide-react";
import FlashcardsContainer from "./FlashcardsContainer";
import { useParams } from "react-router-dom";
import { useNote } from "../../hooks/queries/useNotes";
import { useFlashcards } from "../../hooks/queries/useFlashcards";

const ToolsOutput = ({
  isQuizLoading,
  isFlashcardsLoading,
}: {
  isQuizLoading?: boolean;
  isFlashcardsLoading?: boolean;
}) => {
  const { id } = useParams<{ id: string }>();
  const { data: currentNote } = useNote(id || "");
  const { data: flashcards = [] } = useFlashcards(id || "");

  if (!currentNote) return null;

  const hasQuiz = currentNote?.quiz;
  const hasFlashcards = currentNote?.flashcards && flashcards.length > 0;

  if (!hasQuiz && !hasFlashcards && !isQuizLoading && !isFlashcardsLoading) {
    return null;
  }

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-text-secondary" />
        <h3 className="font-semibold text-sm text-text">Generated Materials</h3>
      </div>

      <div className="flex flex-col gap-2">
        {hasQuiz && !isQuizLoading && (
          <QuizDrawer
            trigger={
              <button className="w-full">
                <div className="bg-bg hover:bg-neutral-100 dark:bg-transparent dark:hover:bg-neutral-800/80 border border-border/50 rounded-xl p-3 flex items-start gap-3 text-left transition-colors cursor-pointer group">
                  <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary-600/10 text-primary-600 dark:text-primary-400">
                    <BadgeQuestionMark className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-text truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Take Quiz</h4>
                    <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">Test your knowledge</p>
                  </div>
                </div>
              </button>
            }
          >
            <QuizContainer />
          </QuizDrawer>
        )}

        {hasFlashcards && !isFlashcardsLoading && (
          <Drawer
            trigger={
              <button className="w-full">
                <div className="bg-bg hover:bg-neutral-100 dark:bg-transparent dark:hover:bg-neutral-800/80 border border-border/50 rounded-xl p-3 flex items-start gap-3 text-left transition-colors cursor-pointer group">
                  <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <ChartBarDecreasing className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-text truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">Study Flashcards</h4>
                    <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">Review key concepts</p>
                  </div>
                </div>
              </button>
            }
            title="Flashcards"
          >
            <FlashcardsContainer />
          </Drawer>
        )}

        {isQuizLoading && (
          <div className="bg-neutral-100 dark:bg-neutral-800/80 border border-border/50 rounded-xl p-3 flex items-start gap-3 text-left transition-colors">
            <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-neutral-200 dark:bg-neutral-700">
              <Loader2 className="w-4 h-4 text-text-secondary animate-spin" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-text">Generating Quiz...</h4>
              <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">Analyzing your notes</p>
            </div>
          </div>
        )}

        {isFlashcardsLoading && (
          <div className="bg-neutral-100 dark:bg-neutral-800/80 border border-border/50 rounded-xl p-3 flex items-start gap-3 text-left transition-colors">
            <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-neutral-200 dark:bg-neutral-700">
              <Loader2 className="w-4 h-4 text-text-secondary animate-spin" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-text">Generating Flashcards...</h4>
              <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">Extracting concepts</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolsOutput;
