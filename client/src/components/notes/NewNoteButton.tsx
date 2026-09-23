import { PlusIcon } from "lucide-react";
import React from "react";
import { useCreateNote } from "../../hooks/queries/useNotes";
import { useNavigate } from "react-router-dom";



function NewNoteButton() {

  const navigate = useNavigate();
  const { mutateAsync: createNote } = useCreateNote();
  return (
    <div
      className="rounded-md p-10 bg-primary-500 text-white flex flex-col items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors duration-300"
      onClick={async () => {
        const newNote = await createNote();
        if (newNote) navigate(`/notes/${newNote._id}`);
      }}
    >
      <PlusIcon className="w-14 h-14" />
      <p className="text-lg">Create New Note</p>
    </div>
  );
}

export default NewNoteButton;
