import React, { JSX } from "react";
import { Source } from "../../shared/types/source";
import {
  Globe,
  Image,
  LucideBookX,
  NotebookText,
  Plus,
  Text,
} from "lucide-react";
import { useNoteStore } from "../../store/noteStore";
import { Button } from "../ui/Button";

type Props = {
  sources: Source[];
};

const dummySources: Source[] = [
  // PDF Sources
  {
    _id: "64f7d5e8b4d4f7001a8b9c7d",
    type: "pdf" as const,
    name: "Quantum Mechanics",
    file_url: "https://example.com/quantum_mechanics.pdf",
    noteId: "64f7d5e8b4d4f7001a8b9c7a",
    status: "parsed" as const,
    createdAt: new Date("2025-09-01T10:00:00Z"),
    updatedAt: new Date("2025-09-01T10:00:00Z"),
  },
  {
    _id: "64f7d5e8b4d4f7001a8b9c7e",
    type: "pdf" as const,
    name: "Lecture Notes",
    file_url: "https://example.com/lecture_notes.pdf",
    noteId: "64f7d5e8b4d4f7001a8b9c7a",
    status: "parsed" as const,
    createdAt: new Date("2025-09-02T14:30:00Z"),
    updatedAt: new Date("2025-09-02T14:30:00Z"),
  },

  // URL Sources
  {
    _id: "64f7d5e8b4d4f7001a8b9c7f",
    type: "website" as const,
    name: "Quantum Mechanics Wikipedia",
    file_url: "https://en.wikipedia.org/wiki/Quantum_mechanics",
    noteId: "64f7d5e8b4d4f7001a8b9c7a",
    status: "parsed" as const,
    createdAt: new Date("2025-09-03T09:15:00Z"),
    updatedAt: new Date("2025-09-03T09:15:00Z"),
  },

  // Text Sources
  {
    _id: "64f7d5e8b4d4f7001a8b9c80",
    type: "text" as const,
    name: "Lecture Notes",
    text: "Key concepts from Professor Smith's lecture on September 1st, 2025. Covered wave-particle duality and the double-slit experiment.",
    noteId: "64f7d5e8b4d4f7001a8b9c7a",
    status: "parsed" as const,
    createdAt: new Date("2025-09-01T16:45:00Z"),
    updatedAt: new Date("2025-09-01T16:45:00Z"),
  },
  {
    _id: "64f7d5e8b4d4f7001a8b9c81",
    type: "text" as const,
    name: "Study Group Notes",
    text: "Study group notes - Quantum entanglement and Bell's theorem discussion from September 5th, 2025.",
    noteId: "64f7d5e8b4d4f7001a8b9c7a",
    status: "parsed" as const,
    createdAt: new Date("2025-09-05T18:30:00Z"),
    updatedAt: new Date("2025-09-05T18:30:00Z"),
  },

  // Image Sources
  {
    _id: "64f7d5e8b4d4f7001a8b9c82",
    type: "image" as const,
    name: "Quantum Circuit Diagram",
    file_url: "https://example.com/quantum_circuit_diagram.png",
    noteId: "64f7d5e8b4d4f7001a8b9c7a",
    status: "parsed" as const,
    createdAt: new Date("2025-09-04T11:20:00Z"),
    updatedAt: new Date("2025-09-04T11:20:00Z"),
  },
];

const SourceListItem = ({ source }: { source: Source }): JSX.Element => {
  return (
    <div className="flex items-center gap-3 rounded-lg py-2 px-3 hover:bg-secondary-500/30">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary-400/30">
        {source.type === "pdf" && <NotebookText />}
        {source.type === "website" && <Globe />}
        {source.type === "text" && <Text />}
        {source.type === "image" && <Image />}
      </div>
      <div>
        <p className="font-medium text-gray-800 ">
          {source.name?.slice(0, 20) + "..." ||
            source.file_url?.slice(0, 20) + "..."}
        </p>
        <p className="text-sm text-dark">
          {source.type[0].toUpperCase() + source.type.slice(1)}
        </p>
      </div>
    </div>
  );
};

const SourceList = () => {
  const { currentNote } = useNoteStore();
  console.log(currentNote?.sources);

  return (
    <div className="space-y-3 overflow-y-auto md:max-h-[55vh] lg:max-h-[60vh]">
      {currentNote?.sources ? (
        currentNote?.sources?.map((source) => (
          <SourceListItem key={source._id} source={source} />
        ))
      ) : (
        <div className="flex flex-col gap-2 items-center justify-center h-[50vh]">
          <LucideBookX className="w-18 h-18 text-neutral-400" />
          <p className="text-neutral-400">No sources added yet</p>
          <Button
            variant="primary"
            className="rounded-full border-2"
            icon={<Plus />}
          >
            Add
          </Button>
        </div>
      )}
    </div>
  );
};

export default SourceList;
