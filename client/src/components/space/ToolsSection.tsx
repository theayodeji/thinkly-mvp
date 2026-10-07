import { BadgeQuestionMark, IdCard, Headphones, MapPinPen, Sparkles } from "lucide-react";
import ToolsOutput from "./ToolsOutput";
import { WorkInProgressDrawer } from "../WorkInProgress";
import { useParams } from "react-router-dom";
import { useGenerateQuiz } from "../../hooks/queries/useQuiz";
import { useGenerateFlashcards } from "../../hooks/queries/useFlashcards";
import { useSpaceSources, useSpace } from "../../hooks/queries/useSpaces";
import { ExplainerModal } from "./ExplainerModal";
import { LearningPathModal } from "./LearningPathModal";
import { usePermissionsAndLimits, MeteredMetric } from "../../hooks/usePermissionsAndLimits";
import toast from "react-hot-toast";

const tools = [
  {
    name: "Generate Quiz",
    description: "Create practice questions from your Spaces",
    icon: <BadgeQuestionMark className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
    action: "quiz",
    isReady: true,
  },
  { 
    name: "Flashcards", 
    description: "Turn your Spaces into flashcards",
    icon: <IdCard className="w-5 h-5 text-primary-600 dark:text-primary-400" />, 
    action: "flashcards", 
    isReady: true 
  },
  { 
    name: "Audio Explainer", 
    description: "Generate a quick audio explanation",
    icon: <Headphones className="w-5 h-5 text-primary-600 dark:text-primary-400" />, 
    action: "explainer", 
    isReady: true 
  },
  {
    name: "Learning Path",
    description: "Create a structured study guide",
    icon: <MapPinPen className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
    action: "learningpath",
    isReady: true,
  },
];

const ToolsSection = () => {
  const { id } = useParams<{ id: string }>();
  const { data: sources, isLoading: isSourcesLoading } = useSpaceSources(id || "");
  const { data: space } = useSpace(id || "");

  const hasContent = Boolean(space?.content?.trim() || (sources && sources.length > 0));
  const isNoContent = !isSourcesLoading && !hasContent;

  const { mutateAsync: generateQuiz, isPending: isQuizLoading } =
    useGenerateQuiz();
  const { mutateAsync: generateFlashcards, isPending: isFlashcardsLoading } =
    useGenerateFlashcards();

  const { getLimitStatus, triggerLimitModal } = usePermissionsAndLimits();
  const quizLimitStatus = getLimitStatus(MeteredMetric.QUIZZES);
  const flashcardLimitStatus = getLimitStatus(MeteredMetric.FLASHCARDS);

  async function handleToolAction(action: string) {
    if (isNoContent) {
      toast.error("Please add a source to this space before using study tools.");
      return;
    }
    try {
      switch (action) {
        case "quiz":
          if (quizLimitStatus.isReached || quizLimitStatus.isLocked) {
            triggerLimitModal("You've reached your daily limit for AI Practice Quizzes.");
            return;
          }
          if (id) await generateQuiz(id);
          break;
        case "flashcards":
          if (flashcardLimitStatus.isReached || flashcardLimitStatus.isLocked) {
            triggerLimitModal("You've reached your daily limit for Flashcards.");
            return;
          }
          if (id) await generateFlashcards(id);
          break;
        default:
          return null;
      }
    } catch (error: any) {
      if (error?.response?.status === 403) {
        triggerLimitModal(error?.response?.data?.message || "Limit reached.");
      } else {
        console.error(`Failed to generate ${action}:`, error);
      }
    }
  }

  return (
    <div className="flex flex-col gap-6 pt-2 pb-8 px-4 lg:pl-0 lg:pr-4">
      {/* Quick Tools */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-text-secondary" />
            <h3 className="font-semibold text-sm text-text">Quick Tools</h3>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {tools.map((tool, index) => {
            const buttonContent = (
              <div className={`glass-panel border-none shadow-[0_2px_12px_rgba(0,0,0,0.04)] rounded-2xl p-3 flex items-start gap-3 text-left transition-all duration-300 group ${
                isNoContent ? "opacity-60 cursor-not-allowed" : "hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
              }`}>
                <div className={`mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-primary-400/10 to-primary-600/10 shadow-inner ${
                  isNoContent ? "" : "group-hover:scale-110"
                } transition-transform`}>
                  {tool.icon}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center min-h-[40px]">
                  <h4 className={`text-sm font-semibold text-text truncate transition-colors ${
                    isNoContent ? "" : "group-hover:text-primary-600 dark:group-hover:text-primary-400"
                  }`}>{tool.name}</h4>
                  <p className="text-xs text-text-secondary line-clamp-1">{tool.description}</p>
                </div>
              </div>
            );

            if (tool.action === "explainer" && id) {
              return (
                <ExplainerModal
                  key={index}
                  spaceId={id}
                  trigger={
                    <button className="w-full text-left">
                      {buttonContent}
                    </button>
                  }
                />
              );
            }

            if (tool.action === "learningpath" && id) {
              return (
                <LearningPathModal
                  key={index}
                  spaceId={id}
                  trigger={
                    <button className="w-full text-left">
                      {buttonContent}
                    </button>
                  }
                />
              );
            }

            return tool.isReady ? (
              <button
                key={index}
                onClick={() => handleToolAction(tool.action)}
                className="w-full"
              >
                {buttonContent}
              </button>
            ) : (
              <WorkInProgressDrawer
                key={index}
                trigger={
                  <div className="w-full opacity-70 hover:opacity-100 transition-opacity">
                    {buttonContent}
                  </div>
                }
              />
            );
          })}
        </div>
      </div>

      <ToolsOutput
        isQuizLoading={isQuizLoading}
        isFlashcardsLoading={isFlashcardsLoading}
      />
    </div>
  );
};

export default ToolsSection;
