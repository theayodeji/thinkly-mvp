import React from "react";
import { useNoteStore } from "../../store/noteStore";
import QuizDrawer from "./QuizDrawer";
import QuizContainer from "./QuizContainer";

const ToolsOutput = () => {
  const isQuizLoading = useNoteStore((state) => state.isQuizLoading);
  const currentNote = useNoteStore((state) => state.currentNote);


  if (!currentNote) return null;
  return (
    <div className="flex flex-col gap-2 mt-4 p-2">
      
      <h2 className="text-lg font-semibold">Tools Output</h2>

      <div className="flex-col flex gap-2">
        {currentNote?.quiz && !isQuizLoading && (
          <QuizDrawer children={<QuizContainer />} />
        )}
        {isQuizLoading && (
          <div className="h-16 w-full flex items-center justify-start px-5 bg-gray-400/30 rounded-md animate-pulse">
            Generating Quiz...
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolsOutput;
