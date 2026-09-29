import { Plus } from "lucide-react";
import SourceList from "./SourceList";
import { memo } from "react";
import { useSpaceUIStore } from "../../store/spaceUIStore";

const SourcesAside = () => {
  const { setAddSourceModalOpen, setSourceDrawerOpen } = useSpaceUIStore();
  
  const handleOpenModal = () => {
    setAddSourceModalOpen(true);
    setSourceDrawerOpen(false); // Close drawer if it's open
  };

  return (
    <aside className="lg:block w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-text-secondary">Attachments</p>
        <button 
          onClick={handleOpenModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-text"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Source</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <SourceList setIsSourceModalOpen={setAddSourceModalOpen} />
      </div>
    </aside>
  );
};

export default memo(SourcesAside);
