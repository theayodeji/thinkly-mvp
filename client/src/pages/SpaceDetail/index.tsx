import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { AlertCircle } from "lucide-react";
import SpacePageHeader from "../../components/space/SpacePageHeader";
import SourcesAside from "../../components/space/SourcesSection";
import ChatInterface from "../../components/space/ChatInterface";
import TabSelect from "../../components/space/TabSelect";
import { useSpace } from "../../hooks/queries/useSpaces";
import ToolsSection from "../../components/space/ToolsSection";
import AddSourceModal from "../../components/space/AddSourceModal";
import { useSpaceUIStore } from "../../store/spaceUIStore";

const SpaceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"sources" | "chat" | "tools">(
    "chat",
  );
  const { isAddSourceModalOpen, setAddSourceModalOpen } = useSpaceUIStore();

  const { data: space, isLoading, isError } = useSpace(id || "");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isError || !space) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-6 text-center max-w-md mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-text mb-2">Space Not Accessible</h2>
        <p className="text-sm text-text-secondary mb-6 leading-relaxed">
          This study space does not exist, has expired, or belongs to another session or user.
        </p>
        <button
          onClick={() => navigate("/")}
          className="btn-3d-primary px-6 py-2.5 rounded-xl text-sm font-semibold"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 h-full flex flex-col overflow-hidden w-full max-w-full">
      <AddSourceModal 
        isOpen={isAddSourceModalOpen}
        setIsOpen={setAddSourceModalOpen}
      />
      {/* Mobile Top Nav/Tabs */}
      <div className="lg:hidden shrink-0">
        <TabSelect activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="flex px-0 pt-0 lg:pt-0 flex-1 min-h-0 overflow-hidden w-full max-w-full">
        {/* Mobile Sources Tab (Desktop uses Drawer in Navbar) */}
        <div
          className={clsx(
            "rounded-md h-full min-h-0 overflow-y-auto lg:hidden px-4 sm:px-6 pb-6",
            activeTab === "sources" ? "block w-full" : "hidden",
          )}
        >
          <SourcesAside />
        </div>

        {/* Center Main Area: Chat */}
        <div
          className={clsx(
            "flex-1 bg-neutral-200 dark:bg-neutral-800/80 lg:bg-transparent lg:dark:bg-transparent rounded-2xl h-full min-h-0 overflow-hidden flex flex-col relative",
            activeTab === "chat" ? "flex w-full" : "hidden lg:flex",
          )}
        >
          <ChatInterface />
        </div>

        {/* Right Area: Tools */}
        <div
          className={clsx(
            "lg:w-90 shrink-0 rounded-md h-full min-h-0 overflow-y-auto lg:border-l lg:border-border/50 lg:pl-6",
            activeTab === "tools" ? "block w-full" : "hidden lg:block",
          )}
        >
          <ToolsSection />
        </div>
      </div>
    </div>
  );
};

export default SpaceDetail;
