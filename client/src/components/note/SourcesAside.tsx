import { Plus } from "lucide-react";
import SourceList from "./SourceList";
import AddSourceModal from "./AddSourceModal";
import { useState, memo } from "react";

const SourcesHeader = ({ onAddClick }: { onAddClick: () => void }) => (
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-semibold text-gray-800">Sources</h3>
    <button 
      onClick={onAddClick}
      className="text-sm text-gray-600"
      aria-label="Add source"
    >
      <Plus className="text-white bg-gradient-primary cursor-pointer p-1 rounded-full"/>
    </button>
  </div>
);

const SourcesAside = () => {
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  console.log('render')
  
  return (
    <aside className="lg:block">
      <SourcesHeader onAddClick={() => setIsSourceModalOpen(true)} />
      <SourceList setIsSourceModalOpen={setIsSourceModalOpen} />
      <AddSourceModal 
        isOpen={isSourceModalOpen} 
        setIsOpen={setIsSourceModalOpen} 
      />
    </aside>
  );
};

export default memo(SourcesAside);