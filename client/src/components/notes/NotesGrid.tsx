import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import NoteMenu from "./NoteMenu";
import { useNoteStore } from "../../store/noteStore";
import { useEffect } from "react";
import NewNoteButton from "./NewNoteButton";
import { Note } from "../../shared/types/note";

const NotesGrid = () => {
  const { getNotes, notes, notesError, isNotesLoading } = useNoteStore();

  useEffect(() => {
    getNotes();
  }, []);

  if (isNotesLoading)
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin rounded-full h-32 w-32 text-primary-500" />
      </div>
    );
  if (notesError) return <p>{notesError.response?.data?.message}</p>;

  return (
    <div className="">
      <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 grid-rows-3 gap-4">
        <NewNoteButton />
        {notes.map((note: Note) => (
          <div key={note._id} className="relative rounded-md bg-white border border-neutral/40 p-4 shadow-lg drop-shadow-xl hover:bg-neutral/50 transition-colors duration-300 ">
            <Link
              to={`/notes/${note._id}`}
              className="h-full flex flex-col"
            >
              <p className="font-semibold text-xl mb-2">
                {note.title.slice(0, 40) +
                  (note.title.length > 40 ? "..." : "")}
              </p>
              <div>
                <p className="text-sm text-gray-500">
                  Created at {new Date().toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  {note.sources.length} sources
                </p>
              </div>
            </Link>
            <NoteMenu />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesGrid;
