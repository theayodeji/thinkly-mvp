import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import clsx from "clsx";
import NotePageHeader from "../../components/note/NotePageHeader";
import SourcesAside from "../../components/note/SourcesSection";
import ChatInterface from "../../components/note/ChatInterface";
import TabSelect from "../../components/note/TabSelect";
import { useNoteStore } from "../../store/noteStore";
import ToolsSection from "../../components/note/ToolsSection";

const NoteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"sources" | "chat" | "tools">(
    "chat"
  );

  const getNote = useNoteStore(s => s.getNote);
  console.log("rerender");

  useEffect(() => {
    if (id) getNote(id);
  }, [id, getNote]);

  return (
    <div className="grid grid-cols-1 lg:grid-rows-[auto_76vh] grid-rows-[auto_auto_72dvh] ">
      <NotePageHeader />
      <TabSelect activeTab={activeTab} onTabChange={setActiveTab} />
      <div>
        <div className="flex px-0 wrapper pt-4 gap-4 h-full overflow-hidden max-w-screen">
          <div
            className={clsx(
              "lg:flex-[1] rounded-md h-full overflow-y-auto",
              activeTab === "sources" ? "block w-full" : "hidden lg:block"
            )}
          >
            <SourcesAside />
          </div>

          <div
            className={clsx(
              "lg:flex-2 bg-neutral-200 dark:bg-neutral-800/80 rounded-md h-full overflow-y-auto",
              activeTab === "chat" ? "block w-full" : "hidden lg:block"
            )}
          >
            <ChatInterface />
          </div>

          <div className={clsx(
              "lg:flex-[1] rounded-md h-full overflow-y-auto",
              activeTab === "tools" ? "block w-full" : "hidden lg:block"
            )}
          >
            <ToolsSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;
