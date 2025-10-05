import { BadgeQuestionMark, IdCard, Key, MapPinPen } from "lucide-react";
import QuizDrawer from "./QuizDrawer";
import QuizContainer from "./QuizContainer";
import { useNoteStore } from "../../store/noteStore";
import ToolsOutput from "./ToolsOutput";

const tools = [
  { name: "Generate Quiz", icon: <BadgeQuestionMark />, action: "quiz" },
  { name: "Flashcards", icon: <IdCard />, action: "flashcards" },
  { name: "Key Points", icon: <Key />, action: "keypoints" },
  { name: "Learning Path", icon: <MapPinPen />, action: "learningpath" },
];

const ToolsSection = () => {

  const generateQuiz = useNoteStore((state) => state.generateQuiz);
  const currentNote = useNoteStore((state) => state.currentNote);

  function handleToolAction(action: string) {
    switch (action) {
      case "quiz":
        generateQuiz(currentNote?._id ||"");
        break;
      case "flashcards":
        return ;
      case "keypoints":
        return ;
      case "learningpath":
        return ;
      default:
        return null;
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Tools</h2>
      <div className="grid grid-cols-2 gap-3">
        {/* <QuizDrawer children={<QuizContainer />} /> */}
        {tools.map((tool, index) => (
          <button
            key={index}
            onClick={() => handleToolAction(tool.action)}
            className="bg-secondary-500/40 hover:bg-secondary-500/30 rounded-md p-4 cursor-pointer flex flex-col items-center justify-center gap-1"
          >
            {tool.icon}
            <span className="text-sm font-medium">{tool.name}</span>
          </button>
        ))}
      </div>
      <ToolsOutput />
    </div>
  );
};

export default ToolsSection;
