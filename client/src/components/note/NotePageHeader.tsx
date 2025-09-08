import { Edit, LucideShare2 } from "lucide-react";
import { Button } from "../ui/Button";

type Props = {};

const NotePageHeader = () => {
  return (
    <div className="flex justify-between items-start gap-4 border-b border-gray-200 bg-white ">
      <div className="flex justify-between items-center wrapper">
        <div className="">
          <h2 className="text-lg md:text-2xl text-start font-bold text-gray-900">
            Quantum Physics Concepts
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" className="p-1">
            <Edit className="h-4 w-4"/>
          </Button>
          <Button size="icon" variant="neutral" >
            <LucideShare2 className="h-4 w-4 md:inline md:mr-2"/>
            <span className="hidden md:inline">Share</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotePageHeader;
