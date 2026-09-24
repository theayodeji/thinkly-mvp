import { BadgeQuestionMark, IdCard, Key, MapPinPen, Sparkles, ChevronRight } from "lucide-react";
import ToolsOutput from "./ToolsOutput";
import { WorkInProgressDrawer } from "../WorkInProgress";
import { useParams } from "react-router-dom";
import { useGenerateQuiz } from "../../hooks/queries/useQuiz";
import { useGenerateFlashcards } from "../../hooks/queries/useFlashcards";

const tools = [
  {
    name: "Generate Quiz",
    description: "Create practice questions from your notes",
    icon: <BadgeQuestionMark className="w-4 h-4" />,
    action: "quiz",
    isReady: true,
  },
  { 
    name: "Flashcards", 
    description: "Turn your notes into flashcards",
    icon: <IdCard className="w-4 h-4" />, 
    action: "flashcards", 
    isReady: true 
  },
  { 
    name: "Key Points", 
    description: "Extract the most important concepts",
    icon: <Key className="w-4 h-4" />, 
    action: "keypoints", 
    isReady: false 
  },
  {
    name: "Learning Path",
    description: "Create a structured study guide",
    icon: <MapPinPen className="w-4 h-4" />,
    action: "learningpath",
    isReady: false,
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
    <div className="flex flex-col gap-6 pt-2 pb-8 pr-4">
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
              <div className="bg-bg hover:bg-neutral-100 dark:bg-transparent dark:hover:bg-neutral-800/80 border border-border/50 rounded-xl p-3 flex items-start gap-3 text-left transition-colors cursor-pointer group">
                <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${index === 0 ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : index === 1 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : index === 2 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>
                  {tool.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-text truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{tool.name}</h4>
                  <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">{tool.description}</p>
                </div>
              </div>
            );

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
