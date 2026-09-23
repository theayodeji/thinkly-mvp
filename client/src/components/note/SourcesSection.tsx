import { Plus } from "lucide-react";
import SourceList from "./SourceList";
import AddSourceModal from "./AddSourceModal";
import { memo } from "react";
import { Button } from "../ui/Button";
import { useDisclosure } from "../../hooks/utils/useDisclosure";

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
  const { isOpen, setIsOpen, open } = useDisclosure(false);
  
  return (
    <aside className="lg:block">
      <SourcesHeader onAddClick={open} />
      <SourceList setIsSourceModalOpen={setIsOpen} />
      <AddSourceModal 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
      />
    </aside>
  );
};

export default memo(SourcesAside);