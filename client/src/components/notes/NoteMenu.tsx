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
import { useNoteStore } from "../../store/noteStore";
import toast from "react-hot-toast";

const NoteMenu = ({ noteId }: { noteId: string }) => {
  const { deleteNote } = useNoteStore();

  const handleDelete = async () => {
    if (noteId) {
      try {
        await deleteNote(noteId).then(() => {
          toast.success("Note deleted successfully");
        });
      } catch (error) {
        console.error("Failed to delete note:", error);
      }
    }
  };

  return (
    <Popover className="absolute top-2 right-2">
      <PopoverButton className="outline-none focus:outline-none cursor-pointer">
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
                className="ml-2 bg-white shadow-2xl drop-shadow-xl rounded-md p-4 w-64 z-50"
              >
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-red-600">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      <span className="font-medium">Delete Note?</span>
                    </div>
                    <PopoverButton className="text-gray-500 hover:text-gray-700">
                      <X className="w-4 h-4" />
                    </PopoverButton>
                  </div>
                  <p className="text-sm text-gray-600">
                    This action cannot be undone. The note will be permanently deleted.
                  </p>
                  <div className="flex justify-end space-x-2">
                    <PopoverButton 
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
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

export default NoteMenu;
