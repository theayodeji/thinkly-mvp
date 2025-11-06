import { useCallback, useState } from "react";
import Flaschcard from "./Flaschcard";
import { ArrowLeft, ArrowRight, Repeat2 } from "lucide-react";

const FlashcardsContainer = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = useCallback(() => {
    console.log("Flipping card");
    setIsFlipped((prev) => !prev);
  }, []);

  return (
    <div
      className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 lg:px-8"
      key={"flashcardcontainer"}
    >
      <div className="w-full max-w-3xl flex justify-between items-center mb-4">
        <span className="text-lg font-semibold text-text">1 / 10</span>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-primary rounded-lg shadow-sm text-white cursor-pointer">
          <Repeat2 className="w-5 h-5" />
          Restart
        </button>
      </div>
      <Flaschcard
        isFlipped={isFlipped}
        question="Who are you"
        answer="I am grrot"
      />
      <div className="flex items-center justify-center gap-4 mt-8">
        <button className="p-4 rounded-full bg-gradient-primary shadow-md cursor-pointer text-white">
          <ArrowLeft className="w-8 h-5" />
        </button>
        <button
          className="cursor-pointer px-8 py-4 font-semibold text-text bg-bg-secondary rounded-full shadow-lg hover:opacity-90 transition-opacity"
          onClick={handleFlip}
        >
          Flip Card
        </button>
        <button className="p-4 rounded-full bg-gradient-primary shadow-md cursor-pointer text-white">
          <ArrowRight className="w-8 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FlashcardsContainer;
