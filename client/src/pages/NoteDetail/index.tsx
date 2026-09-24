import React, { useState } from "react";
import { useParams } from "react-router-dom";
import clsx from "clsx";
import NotePageHeader from "../../components/note/NotePageHeader";
import SourcesAside from "../../components/note/SourcesSection";
import ChatInterface from "../../components/note/ChatInterface";
import TabSelect from "../../components/note/TabSelect";
import { useNote } from "../../hooks/queries/useNotes";
import ToolsSection from "../../components/note/ToolsSection";

const NoteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"sources" | "chat" | "tools">("chat");

  useNote(id || "");

  return (
    <div className="flex flex-col h-full lg:h-[calc(100vh-5rem)]">
      {/* Mobile Top Nav/Tabs */}
      <div className="lg:hidden">
        <NotePageHeader />
        <TabSelect activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="flex px-0 pt-0 lg:pt-0 h-full overflow-hidden max-w-screen">
        {/* Mobile Sources Tab (Desktop uses Drawer in Navbar) */}
        <div
          className={clsx(
            "rounded-md h-full overflow-y-auto lg:hidden",
            activeTab === "sources" ? "block w-full" : "hidden",
          )}
        >
          <SourcesAside />
        </div>

        {/* Center Main Area: Chat */}
        <div
          className={clsx(
            "flex-1 bg-neutral-200 dark:bg-neutral-800/80 lg:bg-transparent lg:dark:bg-transparent rounded-2xl h-full overflow-hidden flex flex-col relative",
            activeTab === "chat" ? "flex w-full" : "hidden lg:flex",
          )}
        >
          <ChatInterface />
        </div>

        {/* Right Area: Tools */}
        <div
          className={clsx(
            "lg:w-80 shrink-0 rounded-md h-full overflow-y-auto lg:border-l lg:border-border/50 lg:pl-6",
            activeTab === "tools" ? "block w-full" : "hidden lg:block",
          )}
        >
          <ToolsSection />
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;
