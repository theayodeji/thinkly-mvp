import { Copy, WandSparkles } from "lucide-react";
import { Button } from "../ui/Button";
import { useNoteStore } from "../../store/noteStore";

const SummaryBlock = () => {
  const { currentNote } = useNoteStore();

  return (
    <div className="bg-white rounded-md p-2">
      <h3 className="font-medium text-gray-800 text-wrap md:text-lg">
        {currentNote?.title || "Untitled Note"}
        <Button
          variant="primary"
          size="icon"
          className="ml-2 rounded-[100%] scale-80 sm:scale-100"
        >
          <WandSparkles className="inline h-5" />
        </Button>
      </h3>
      <p className="text-xs text-gray-400 italic">
        Based on {currentNote?.sources?.length || 0}{" "}
        {currentNote?.sources?.length === 1 ? "source" : "sources"}
      </p>
      <p className="text-sm text-gray-800 mt-2 line-clamp-3">
        {currentNote?.summary || "Summary will appear here"}
        <Copy className="inline ml-1 cursor-pointer text-gray-500 w-4 h-4" />
      </p>
    </div>
  );
};

export default SummaryBlock;
