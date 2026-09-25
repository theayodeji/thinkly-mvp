import { PlusIcon } from "lucide-react";
import React from "react";
import { useCreateSpace } from "../../hooks/queries/useSpaces";
import { useNavigate } from "react-router-dom";



function NewSpaceButton() {

  const navigate = useNavigate();
  const { mutateAsync: createSpace } = useCreateSpace();
  return (
    <div
      className="rounded-md p-10 bg-primary-500 text-white flex flex-col items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors duration-300"
      onClick={async () => {
        const newSpace = await createSpace();
        if (newSpace) navigate(`/spaces/${newSpace._id}`);
      }}
    >
      <PlusIcon className="w-14 h-14" />
      <p className="text-lg">Create New Space</p>
    </div>
  );
}

export default NewSpaceButton;
