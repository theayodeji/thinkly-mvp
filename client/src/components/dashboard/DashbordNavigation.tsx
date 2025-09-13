import { PenLine, PlusCircle, BookDashed, Timer } from "lucide-react";

const DashbordNavigation = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-4">
      <button className="flex flex-col md:flex-row items-center justify-center gap-2 py-4 bg-primary-500 text-white font-bold rounded-xl shadow-sm hover:bg-primary-600 transition-colors cursor-pointer">
        <PlusCircle />
        Create Note
      </button>
      <button className="flex flex-col md:flex-row items-center justify-center gap-2 py-4 bg-white border border-gray-200/80 font-semibold rounded-xl shadow-sm hover:bg-gray-200 transition-colors cursor-pointer">
        <PenLine />
        Transcribe Tool
      </button>
      <button className="flex flex-col md:flex-row items-center justify-center gap-2 py-4 bg-white border border-gray-200/80 font-semibold rounded-xl shadow-sm hover:bg-gray-200 transition-colors cursor-pointer">
        <BookDashed />
        Start Quiz
      </button>
      <button className="flex flex-col md:flex-row items-center justify-center gap-2 py-4 bg-white border border-gray-200/80 font-semibold rounded-xl shadow-sm hover:bg-gray-200 transition-colors cursor-pointer">
        <Timer />
        Start Pomodoro
      </button>
    </div>
  );
};

export default DashbordNavigation;
