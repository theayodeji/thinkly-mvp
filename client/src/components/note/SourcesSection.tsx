import { Plus } from "lucide-react";
import SourceList from "./SourceList";
import AddSourceModal from "./AddSourceModal";
import { memo } from "react";
import { useDisclosure } from "../../hooks/utils/useDisclosure";

const SourcesAside = () => {
  const { isOpen, setIsOpen, open } = useDisclosure(false);
  
  return (
    <aside className="lg:block w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-text-secondary">Attachments</p>
        <button 
          onClick={open}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-text"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Source</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <SourceList setIsSourceModalOpen={setIsOpen} />
      </div>
      
      <AddSourceModal 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
      />
    </aside>
  );
};

export default memo(SourcesAside);