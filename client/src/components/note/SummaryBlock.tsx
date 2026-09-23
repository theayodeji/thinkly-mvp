import { Copy, WandSparkles } from "lucide-react";
import { Sparkles } from "lucide-react";
import { useParams } from "react-router-dom";
import { useNote } from "../../hooks/queries/useNotes";
import { Button } from "../ui/Button";
import toast from "react-hot-toast";

const copySummary = (summary: string) => {
  navigator.clipboard.writeText(summary);
  toast.success("Summary copied to clipboard");
};

const SummaryBlock = () => {
  const { id } = useParams<{ id: string }>();
  const { data: currentNote, isLoading: isActionLoading } = useNote(id || "");

  if (isActionLoading)
    return (
      <div className="max-w-[80%] px-3 py-2 rounded-lg text-sm bg-secondary-500/10 border border-secondary-500/20 text-text self-start">
        <div className="flex items-center gap-2 mb-2 text-secondary-600 dark:text-secondary-400 font-medium"></div>
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
