import QuizDrawer from "./QuizDrawer";
import QuizContainer from "./QuizContainer";
import Drawer from "../ui/Drawer";
import { ChartBarDecreasing } from "lucide-react";
import FlashcardsContainer from "./FlashcardsContainer";
import { useParams } from "react-router-dom";
import { useNote } from "../../hooks/queries/useNotes";
import { useFlashcards } from "../../hooks/queries/useFlashcards";

const ToolsOutput = ({
  isQuizLoading,
  isFlashcardsLoading,
}: {
  isQuizLoading?: boolean;
  isFlashcardsLoading?: boolean;
}) => {
  const { id } = useParams<{ id: string }>();
  const { data: currentNote } = useNote(id || "");
  const { data: flashcards = [] } = useFlashcards(id || "");

  if (!currentNote) return null;
  return (
    <div className="flex flex-col gap-2 mt-4 p-2">
      <h2 className="text-lg font-semibold">Tools Output</h2>

      <div className="flex-col flex gap-2">
        {currentNote?.quiz && !isQuizLoading && (
          <QuizDrawer children={<QuizContainer />} />
        )}

        {currentNote.flashcards &&
          !isFlashcardsLoading &&
          flashcards.length > 0 && (
            <Drawer
              trigger={
                <div className="flex flex-col gap-3 px-3 py-4 border-2 border-secondary-500/30 dark:border-secondary-500/10 rounded-md cursor-pointer hover:bg-secondary-400/10">
                  <div className="flex gap-2 w-full">
                    <ChartBarDecreasing className="w-6 h-6" />
                    <p>Flashcards</p>
                  </div>
                </div>
              }
              title="Flashcards"
            >
              <FlashcardsContainer />
            </Drawer>
          )}

        {isQuizLoading && (
          <div className="h-16 w-full flex items-center justify-start px-5 bg-gray-400/30 rounded-md animate-pulse">
            Generating a new quiz...
          </div>
        )}
        {isFlashcardsLoading && (
          <div className="h-16 w-full flex items-center justify-start px-5 bg-gray-400/30 rounded-md animate-pulse">
            Generating a new set...
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolsOutput;
