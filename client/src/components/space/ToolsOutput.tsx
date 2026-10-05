import QuizDrawer from "./QuizDrawer";
import QuizContainer from "./QuizContainer";
import Drawer from "../ui/Drawer";
import { IdCard, BadgeQuestionMark, Sparkles, Loader2 } from "lucide-react";
import FlashcardsContainer from "./FlashcardsContainer";
import { useParams } from "react-router-dom";
import { useSpace } from "../../hooks/queries/useSpaces";
import { useFlashcards } from "../../hooks/queries/useFlashcards";
import { useQuiz } from "../../hooks/queries/useQuiz";
import { useExplainers } from "../../hooks/queries/useExplainers";
import AudioExplainerCard from "./AudioExplainerCard";
import { useLearningPaths } from "../../hooks/queries/useLearningPath";
import LearningPathView from "./LearningPathView";
import { MapPinPen } from "lucide-react";

const ToolsOutput = ({
  isQuizLoading,
  isFlashcardsLoading,
}: {
  isQuizLoading?: boolean;
  isFlashcardsLoading?: boolean;
}) => {
  const { id } = useParams<{ id: string }>();
  const { data: currentSpace } = useSpace(id || "");
  const { data: flashcards = [] } = useFlashcards(id || "");
  const { data: quiz } = useQuiz(id || ""); 
  const { data: explainers = [] } = useExplainers(id || "");
  const { data: learningPaths = [] } = useLearningPaths(id || "");

  if (!currentSpace) return null;

  const hasQuiz = !!quiz;
  const hasFlashcards = flashcards.length > 0;
  const hasExplainers = explainers.length > 0;
  const hasLearningPaths = learningPaths.length > 0;

  if (!hasQuiz && !hasFlashcards && !hasExplainers && !hasLearningPaths && !isQuizLoading && !isFlashcardsLoading) {
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
              <div className="glass-panel border-none shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-lg hover:-translate-y-0.5 rounded-2xl p-3 flex items-start gap-3 text-left transition-all duration-300 cursor-pointer group">
                <div className="mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-primary-400/10 to-primary-600/10 group-hover:scale-110 transition-transform shadow-inner">
                  <BadgeQuestionMark className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center min-h-[40px]">
                  <h4 className="text-sm font-semibold text-text truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Take Quiz</h4>
                  <p className="text-xs text-text-secondary line-clamp-1">Test your knowledge</p>
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
              <div className="glass-panel border-none shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-lg hover:-translate-y-0.5 rounded-2xl p-3 flex items-start gap-3 text-left transition-all duration-300 cursor-pointer group">
                <div className="mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-primary-400/10 to-primary-600/10 group-hover:scale-110 transition-transform shadow-inner">
                  <IdCard className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center min-h-[40px]">
                  <h4 className="text-sm font-semibold text-text truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Study Flashcards</h4>
                  <p className="text-xs text-text-secondary line-clamp-1">Review key concepts</p>
                </div>
              </div>
            </button>
            }
            title="Flashcards"
          >
            <FlashcardsContainer />
          </Drawer>
        )}
        
        {hasLearningPaths && (
          <Drawer
            trigger={
              <button className="w-full">
                <div className="glass-panel border-none shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-lg hover:-translate-y-0.5 rounded-2xl p-3 flex items-start gap-3 text-left transition-all duration-300 cursor-pointer group">
                  <div className="mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-primary-400/10 to-primary-600/10 group-hover:scale-110 transition-transform shadow-inner">
                    <MapPinPen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center min-h-[40px]">
                    <h4 className="text-sm font-semibold text-text truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Learning Path</h4>
                    <p className="text-xs text-text-secondary line-clamp-1">
                      {learningPaths[0]?.topic || "View your roadmap"}
                    </p>
                  </div>
                </div>
              </button>
            }
            title="Learning Path"
          >
            <LearningPathView />
          </Drawer>
        )}

        {explainers.map((explainer: any) => (
          <AudioExplainerCard key={explainer._id} explainer={explainer} />
        ))}

        {isQuizLoading && (
          <div className="bg-neutral-100 dark:bg-neutral-800/80 border border-border/50 rounded-xl p-3 flex items-start gap-3 text-left transition-colors">
            <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-neutral-200 dark:bg-neutral-700">
              <Loader2 className="w-4 h-4 text-text-secondary animate-spin" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-text">Generating Quiz...</h4>
              <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">Analyzing your Spaces</p>
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
