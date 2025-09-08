import { PlusIcon } from "lucide-react";
import React from "react";
import { useNoteStore } from "../../store/noteStore";

type Props = {};

function NewNoteButton({}: Props) {
    const {createNote} = useNoteStore();
  return (
    <div className="rounded-md p-10 bg-primary-500 text-white flex flex-col items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors duration-300"
    onClick={createNote}
    >
      <PlusIcon className="w-14 h-14" />
      <p className="text-lg">Create New Note</p>
    </div>
  );
}

export default NewNoteButton;
