import { Copy, WandSparkles } from "lucide-react";
import { useParams } from "react-router-dom";
import { useNote } from "../../hooks/queries/useNotes";
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
      <div className="flex gap-4 p-4 max-w-3xl">
        <div className="w-8 h-8 rounded-full bg-primary-600/20 animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="animate-pulse h-4 bg-border/50 rounded w-1/4" />
          <div className="animate-pulse h-24 bg-border/50 rounded w-full" />
        </div>
      </div>
    );

  if (!currentNote?.summary) return null;

  return (
    <div className="flex gap-4 p-4 max-w-3xl mb-4 group">
      <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 shadow-md">
        <WandSparkles className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-text text-sm">Thinkly Summary</span>
        </div>
        <div className="text-text/90 leading-relaxed text-sm">
          {currentNote.summary}
        </div>
        <div className="flex items-center gap-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => copySummary(currentNote.summary || "")}
            className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text transition-colors"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Copy</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryBlock;
