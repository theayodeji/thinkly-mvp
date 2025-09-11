import { Copy, WandSparkles } from "lucide-react";
import { Button } from "../ui/Button";
import { useNoteStore } from "../../store/noteStore";
import toast from "react-hot-toast";

const copySummary = (summary: string) => {
  navigator.clipboard.writeText(summary);
  toast.success("Summary copied to clipboard");
};

const SummaryBlock = () => {
  const { currentNote, isActionLoading } = useNoteStore();
  if (isActionLoading)
    return (
      <div className="bg-white rounded-md p-2">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 h-16 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );

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
      <p className="text-sm text-gray-800 mt-2">
        {currentNote?.summary || "Summary will appear here"}
        <Copy
          className="inline ml-1 cursor-pointer text-gray-500 w-4 h-4"
          onClick={() => copySummary(currentNote?.summary || "")}
        />
      </p>
    </div>
  );
};

export default SummaryBlock;
