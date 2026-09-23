import { BadgeQuestionMark, IdCard, Key, MapPinPen } from "lucide-react";
import ToolsOutput from "./ToolsOutput";
import { WorkInProgressDrawer } from "../WorkInProgress";
import { useParams } from "react-router-dom";
import { useGenerateQuiz } from "../../hooks/queries/useQuiz";
import { useGenerateFlashcards } from "../../hooks/queries/useFlashcards";

const tools = [
  {
    name: "Generate Quiz",
    icon: <BadgeQuestionMark />,
    action: "quiz",
    isReady: true,
  },
  { name: "Flashcards", icon: <IdCard />, action: "flashcards", isReady: true },
  { name: "Key Points", icon: <Key />, action: "keypoints", isReady: false },
  {
    name: "Learning Path",
    icon: <MapPinPen />,
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
      case "keypoints":
        return;
      case "learningpath":
        return;
      default:
        return null;
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Tools</h2>
      <div className="grid grid-cols-2 gap-3">
        {/* <QuizDrawer children={<QuizContainer />} /> */}
        {tools.map((tool, index) =>
          tool.isReady ? (
            <button
              key={index}
              onClick={() => handleToolAction(tool.action)}
              className="bg-secondary-500/40 hover:bg-secondary-500/30 rounded-md p-4 cursor-pointer flex flex-col items-center justify-center gap-1"
            >
              {tool.icon}
              <span className="text-sm font-medium">{tool.name}</span>
            </button>
          ) : (
            <WorkInProgressDrawer
              key={index}
              trigger={
                <button
                  onClick={() => handleToolAction(tool.action)}
                  className="bg-secondary-500/40 hover:bg-secondary-500/30 rounded-md p-4 cursor-pointer flex flex-col items-center justify-center gap-1"
                >
                  {tool.icon}
                  <span className="text-sm font-medium">{tool.name}</span>
                </button>
              }
            />
          ),
        )}
      </div>
      <ToolsOutput
        isQuizLoading={isQuizLoading}
        isFlashcardsLoading={isFlashcardsLoading}
      />
    </div>
  );
};

export default ToolsSection;
