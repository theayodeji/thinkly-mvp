import { Grip, LucideShare2 } from "lucide-react";
import { Button } from "../ui/Button";
import { useNoteStore } from "../../store/noteStore";
import { BackNavigator } from "../ui/BackNavigator";

const NotePageHeader = () => {
  const { currentNote } = useNoteStore();
  return (
    <div className="flex md:justify-between items-start gap-4 border-b border-gray-200 dark:border-neutral-800">
      <div className="flex justify-between items-center wrapper">
        <div className="w-4/5 flex items-center">
          <BackNavigator label=""className="p-2 mr-2 text-text"/>
          <h2 className="text-lg md:text-xl md:w-full text-start font-bold text-text truncate">
            {currentNote?.title || "Untitled Note"}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" className="p-2">
            <Grip className="h-4 w-4"/>
          </Button>
          <Button size="icon" variant="neutral" className="p-1.5" >
            <LucideShare2 className="h-3 w-3 md:inline md:mr-2"/>
            <span className="hidden md:inline text-sm">Share</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotePageHeader;
