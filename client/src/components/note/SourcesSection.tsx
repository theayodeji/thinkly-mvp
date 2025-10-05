import { Plus } from "lucide-react";
import SourceList from "./SourceList";
import AddSourceModal from "./AddSourceModal";
import { useState, memo } from "react";
import { Button } from "../ui/Button";

const SourcesHeader = ({ onAddClick }: { onAddClick: () => void }) => (
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-semibold text-text">Sources</h3>
    <Button 
      onClick={onAddClick}
      className=""
      aria-label="Add source"
      variant="primary"
      icon={<Plus className="h-4 w-4"/>}
    >
      Add
    </Button>
  </div>
);

const SourcesAside = () => {
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  
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