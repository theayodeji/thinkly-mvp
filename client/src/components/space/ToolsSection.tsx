import { BadgeQuestionMark, IdCard, Headphones, MapPinPen, Sparkles, ChevronRight } from "lucide-react";
import ToolsOutput from "./ToolsOutput";
import { WorkInProgressDrawer } from "../WorkInProgress";
import { useParams } from "react-router-dom";
import { useGenerateQuiz } from "../../hooks/queries/useQuiz";
import { useGenerateFlashcards } from "../../hooks/queries/useFlashcards";
import { ExplainerModal } from "./ExplainerModal";
import { LearningPathModal } from "./LearningPathModal";

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
  const { mutateAsync: generateQuiz, isPending: isQuizLoading } =
    useGenerateQuiz();
  const { mutateAsync: generateFlashcards, isPending: isFlashcardsLoading } =
    useGenerateFlashcards();

  function handleToolAction(action: string) {
    switch (action) {
      case "quiz":
        if (id) generateQuiz(id);
        break;
      case "flashcards":
        if (id) generateFlashcards(id);
        return;
      default:
        return null;
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
              <div className="glass-panel border-none shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-lg hover:-translate-y-0.5 rounded-2xl p-3 flex items-start gap-3 text-left transition-all duration-300 cursor-pointer group">
                <div className="mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-primary-400/10 to-primary-600/10 group-hover:scale-110 transition-transform shadow-inner">
                  {tool.icon}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center min-h-[40px]">
                  <h4 className="text-sm font-semibold text-text truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{tool.name}</h4>
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
