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
      <div className="flex flex-col bg-white dark:bg-neutral-600 rounded-md p-2 w-full gap-3">
        <div className="animate-pulse h-6 bg-gray-200 rounded w-full"></div>
        <div className="animate-pulse h-4 bg-gray-200 rounded w-24"></div>
        <div className="animate-pulse h-16 bg-gray-200 rounded w-full"></div>
      </div>
    );

  return (
    <div className="bg-bg rounded-md p-2 mb-8">
      <h3 className="font-medium text-text text-wrap md:text-lg">
        {currentNote?.title || "Untitled Note"}
        <Button
          variant="primary"
          size="icon"
          className="ml-2 scale-80 sm:scale-100"
        >
          <WandSparkles className="inline h-5" />
        </Button>
      </h3>
      <p className="text-xs text-text-secondary italic">
        Based on {currentNote?.sources?.length || 0}{" "}
        {currentNote?.sources?.length === 1 ? "source" : "sources"}
      </p>
      <p className="text-sm text-text mt-2">
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
