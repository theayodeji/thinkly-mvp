import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import clsx from "clsx";
import NotePageHeader from "../../components/note/NotePageHeader";
import SourcesAside from "../../components/note/SourcesAside";
import ChatInterface from "../../components/note/ChatInterface";
import TabSelect from "../../components/TabSelect";
import { useNoteStore } from "../../store/noteStore";

const NoteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"sources" | "chat">("chat");

  const { getNote }  = useNoteStore();

  useEffect(() => {
    if (id) getNote(id);
  }, [id, getNote]);

  return (
    <div className="grid lg:grid-rows-[auto_76vh] grid-rows-[auto_auto_70dvh]">
      <NotePageHeader />
      <TabSelect activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex wrapper pt-4 gap-4 h-full overflow-hidden">
        <div
          className={clsx(
            "lg:flex-[1.1] p-4 rounded-md h-full overflow-y-auto",
            activeTab === "sources" ? "block w-full" : "hidden lg:block"
          )}
        >
          <SourcesAside />
        </div>

        <div
          className={clsx(
            "lg:flex-2 bg-neutral-200 rounded-md h-full overflow-y-auto",
            activeTab === "chat" ? "block w-full" : "hidden lg:block"
          )}
        >
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;
