import { PenLine, PlusCircle, BookDashed, Timer } from "lucide-react";
import { useCreateSpace, useSpaces } from "../../hooks/queries/useSpaces";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { usePermissionsAndLimits, MeteredMetric } from "../../hooks/usePermissionsAndLimits";

const DashbordNavigation = () => {
  const navigate = useNavigate();
  const { mutateAsync: createSpace } = useCreateSpace();
  const { data: spacesData } = useSpaces();

  const { getLimitStatus, triggerLimitModal } = usePermissionsAndLimits();
  const activeSpacesLimit = getLimitStatus(MeteredMetric.ACTIVE_SPACES);
  const isSpaceLimitReached = (spacesData?.length || 0) >= activeSpacesLimit.max && activeSpacesLimit.max !== Infinity;

  async function createSpaceHandler() {
    if (isSpaceLimitReached) {
      triggerLimitModal("You've reached your maximum limit for active study spaces.");
      return;
    }
    
    try {
      const space = await createSpace();
      toast.success("Space created successfully");
      navigate(`/spaces/${space?._id}`);
    } catch (error: any) {
      if (error?.response?.status === 403) {
        triggerLimitModal(error.response.data.message || "Space creation limit reached.");
      } else {
        console.error("Failed to create Space:", error);
      }
    }
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-4">
      <button
        onClick={() => createSpaceHandler()}
        className="flex flex-col md:flex-row items-center justify-center gap-2 py-4 bg-gradient-primary text-white font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
      >
        <PlusCircle />
        Create Space
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
