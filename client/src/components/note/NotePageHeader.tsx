import { Grip, LucideShare2, FileText } from "lucide-react";
import { Button } from "../ui/Button";
import { useParams } from "react-router-dom";
import { useNote } from "../../hooks/queries/useNotes";
import { BackNavigator } from "../ui/BackNavigator";

interface NotePageHeaderProps {
  onOpenSources?: () => void;
}

const NotePageHeader = ({ onOpenSources }: NotePageHeaderProps) => {
  const { id } = useParams<{ id: string }>();
  const { data: currentNote } = useNote(id || "");
  const sourcesCount = currentNote?.sources?.length || 0;

  return (
    <div className="flex justify-between items-start gap-4 p-4 lg:p-6 lg:border-none">
      <div className="flex flex-col w-full">
        <div className="flex items-center">
          <BackNavigator label="" className="p-2 mr-2 text-text lg:hidden" />
          <h2 className="text-xl md:text-2xl font-bold text-text truncate">
            {currentNote?.title || "Untitled Note"}
          </h2>
        </div>
        
        {/* Sources Pill under title on desktop */}
        <div className="hidden lg:flex items-center mt-2 ml-2">
          <button 
            onClick={onOpenSources}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-200/50 dark:bg-neutral-800/50 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-sm text-text-secondary font-medium"
          >
            <FileText className="h-4 w-4" />
            <span>{sourcesCount} sources</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button size="icon" className="p-2 lg:hidden">
          <Grip className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="neutral" className="p-1.5">
          <LucideShare2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default NotePageHeader;
