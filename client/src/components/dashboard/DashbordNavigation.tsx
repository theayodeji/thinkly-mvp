import { PenLine, PlusCircle, BookDashed, Timer } from "lucide-react";
import { useNoteStore } from "../../store/noteStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const DashbordNavigation = () => {
  const navigate = useNavigate();
  const createNote = useNoteStore((state) => state.createNote);

  function createNoteHandler() {
    createNote().then((note) => {
      toast.success("Note created successfully");
      navigate(`/notes/${note?._id}`);
    });
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-4">
      <button
        onClick={() => createNoteHandler()}
        className="flex flex-col md:flex-row items-center justify-center gap-2 py-4 bg-gradient-primary text-white font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
      >
        <PlusCircle />
        Create Note
      </button>
      <button className="flex flex-col md:flex-row items-center justify-center gap-2 py-4 bg-bg border border-gray-200/80 dark:border-neutral/20 font-semibold rounded-xl shadow-sm hover:bg-bg-secondary transition-colors cursor-pointer">
        <PenLine />
        Transcribe Tool
      </button>
      <button className="flex flex-col md:flex-row items-center justify-center gap-2 py-4 bg-bg border border-gray-200/80 dark:border-neutral/20 font-semibold rounded-xl shadow-sm hover:bg-bg-secondary transition-colors cursor-pointer">
        <BookDashed />
        Start Quiz
      </button>
      <button className="flex flex-col md:flex-row items-center justify-center gap-2 py-4 bg-bg border border-gray-200/80 dark:border-neutral/20 font-semibold rounded-xl shadow-sm hover:bg-bg-secondary transition-colors cursor-pointer">
        <Timer />
        Start Pomodoro
      </button>
    </div>
  );
};

export default DashbordNavigation;
