import React from "react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import {
  EditIcon,
  EllipsisVertical,
  Share2Icon,
  Trash2Icon,
} from "lucide-react";



const NoteMenu = () => {

  return (
    <Popover
      className="absolute top-2 right-2"
    >
      <PopoverButton className="outline-none focus:outline-none cursor-pointer">
        <EllipsisVertical className="" />
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="items-start flex flex-col bg-white shadow-2xl drop-shadow-xl rounded-md"
      >
        <button
          className="w-full flex items-center justify-start py-4 px-8 pl-4 hover:bg-neutral-300 transition-colors duration-300 cursor-pointer"
        >
          <EditIcon className="inline w-4 h-4 mr-2" /> Rename
        </button>
        <button
          className="w-full flex items-center justify-start py-4 px-8 pl-4 hover:bg-neutral-300 transition-colors duration-300 cursor-pointer"
        >
          <Share2Icon className="inline w-4 h-4 mr-2" /> Share
        </button>
        <button
          className="w-full flex items-center justify-start py-4 px-8 pl-4 hover:bg-neutral-300 transition-colors duration-300 cursor-pointer"
        >
          <Trash2Icon className="inline w-4 h-4 mr-2 text-tertiary" /> Delete
        </button>
      </PopoverPanel>
    </Popover>
  );
};

export default NoteMenu;
