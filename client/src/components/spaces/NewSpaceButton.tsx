import { Plus } from "lucide-react";
import React from "react";
import { useCreateSpace } from "../../hooks/queries/useSpaces";
import { useNavigate } from "react-router-dom";

function NewSpaceButton() {
  const navigate = useNavigate();
  const { mutateAsync: createSpace } = useCreateSpace();
  
  return (
    <button
      onClick={async () => {
        const newSpace = await createSpace();
        if (newSpace) navigate(`/spaces/${newSpace._id}`);
      }}
      className="group relative flex flex-col items-center justify-center h-full min-h-[160px] w-full rounded-xl border-2 border-dashed border-primary-500/40 dark:border-primary-500/50 bg-primary-500/5 hover:bg-primary-500/10 dark:hover:bg-primary-500/20 hover:border-primary-500 transition-all duration-200"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-500/20 mb-3 group-hover:scale-110 group-hover:bg-primary-500/30 transition-all duration-200">
        <Plus className="w-6 h-6 text-primary-600 dark:text-primary-400" />
      </div>
      <p className="text-primary-600 dark:text-primary-400 font-medium text-lg">Create New Space</p>
    </button>
  );
}

export default NewSpaceButton;
