import React from "react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import {
  AlertTriangle,
  EditIcon,
  EllipsisVertical,
  Share2Icon,
  Trash2Icon,
  X,
} from "lucide-react";
import { useDeleteSpace } from "../../hooks/queries/useSpaces";
import toast from "react-hot-toast";

const SpaceMenu = ({ SpaceId }: { SpaceId: string }) => {
  const { mutateAsync: deleteSpace } = useDeleteSpace();

  const handleDelete = async () => {
    if (SpaceId) {
      try {
        await deleteSpace(SpaceId);
        toast.success("Space deleted successfully");
      } catch (error) {
        console.error("Failed to delete Space:", error);
      }
    }
  };

  return (
    <Popover className="relative">
      <PopoverButton className="outline-none focus:outline-none p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-text-secondary">
        <EllipsisVertical />
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="items-start flex flex-col bg-bg-secondary shadow-2xl drop-shadow-xl rounded-md z-50"
      >
        <button
          className="w-full flex items-center justify-start py-4 px-8 pl-4 hover:bg-neutral/60 transition-colors duration-300 cursor-pointer"
        >
          <EditIcon className="inline w-4 h-4 mr-2" /> Rename
        </button>
        <button
          className="w-full flex items-center justify-start py-4 px-8 pl-4 hover:bg-neutral/60 transition-colors duration-300 cursor-pointer"
        >
          <Share2Icon className="inline w-4 h-4 mr-2" /> Share
        </button>
        
        <Popover className="w-full">
          {({ open }) => (
            <>
              <PopoverButton 
                className={`outline-none w-full flex items-center justify-start py-4 px-8 pl-4 hover:bg-red-300/60 transition-colors duration-300 cursor-pointer ${
                  open ? 'bg-red-50 text-red-600' : ''
                }`}
              >
                <Trash2Icon className="inline w-4 h-4 mr-2 text-red-500" />
                <span>Delete</span>
              </PopoverButton>
              
              <PopoverPanel 
                anchor="right" 
                className="ml-2 bg-bg border border-border shadow-2xl drop-shadow-xl rounded-md p-4 w-64 z-50"
              >
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-red-600">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      <span className="font-medium">Delete Space?</span>
                    </div>
                    <PopoverButton className="text-text-secondary hover:text-text transition-colors">
                      <X className="w-4 h-4" />
                    </PopoverButton>
                  </div>
                  <p className="text-sm text-text-secondary">
                    This action cannot be undone. The Space will be permanently deleted.
                  </p>
                  <div className="flex justify-end space-x-2">
                    <PopoverButton 
                      className="px-4 py-2 text-sm text-text-secondary hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-md transition-colors"
                    >
                      Cancel
                    </PopoverButton>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </PopoverPanel>
            </>
          )}
        </Popover>
      </PopoverPanel>
    </Popover>
  );
};

export default SpaceMenu;
