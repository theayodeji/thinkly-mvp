import { LucideBookX, Plus } from "lucide-react";
import { Button } from "../ui/Button";

type Props = {
  setIsSourceModalOpen: (isOpen: boolean) => void;
};

const NoSource = ({setIsSourceModalOpen} : Props) => {
  return (
    <div className="flex flex-col gap-2 items-center justify-center h-[50vh]">
      <LucideBookX className="w-18 h-18 text-neutral-400" strokeWidth={1} />
      <p className="text-neutral-400">No sources added yet</p>
      <Button
        variant="ghost"
        className="border-2 outline "
        icon={<Plus className="h-4 w-4"/>}
        onClick={() => setIsSourceModalOpen(true)}
      >
        Add
      </Button>
    </div>
  );
};

export default NoSource;
