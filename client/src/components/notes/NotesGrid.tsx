import { Link } from "react-router-dom";
import NoteMenu from "./NoteMenu";
import { useNotes } from "../../hooks/queries/useNotes";
import { useState, useMemo, useCallback } from "react";
import NewNoteButton from "./NewNoteButton";
import { Note } from "../../shared/types/note";
import SearchBar from "../ui/SearchBar";
import { ErrorState } from "../ui/ErrorState";

const NotesGrid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: notes = [],
    error: notesError,
    isLoading: isNotesLoading,
    refetch
  } = useNotes(searchQuery);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  if (isNotesLoading) {
    return (
      <div className="flex w-full items-center justify-center">
        <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 grid-rows-[1fr_1fr_1fr] gap-4">
          {[...Array(9)].map((_, index) => (
            <div
              key={index}
              className="relative rounded-md shadow-lg drop-shadow-xl animate-pulse"
            >
              <div className="h-[140px] w-full bg-neutral/20 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (notesError) {
    return <ErrorState message={notesError.message} onRetry={() => refetch()} />;
  }

  const hasFilteredNotes = notes.length > 0;

  return (
    <div className="space-y-6">
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search notes by title or content..."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 auto-rows-fr gap-4">
        <NewNoteButton />
        {hasFilteredNotes ? (
          notes.map((note: Note) => (
            <div
              key={note._id}
              className="relative rounded-md bg-bg border border-neutral/40 p-4 shadow-lg drop-shadow-xl hover:bg-neutral/50 transition-colors duration-300"
            >
              <Link to={`/notes/${note._id}`} className="h-full flex flex-col">
                <p className="font-semibold text-xl mb-2 w-[80%]">
                  {note.title.slice(0, 40) +
                    (note.title.length > 40 ? "..." : "")}
                </p>
                <div>
                  <p className="text-sm text-text">
                    Created at {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-text">
                    {note.sources?.length || 0} sources
                  </p>
                </div>
              </Link>
              <NoteMenu noteId={note._id} />
            </div>
          ))
        ) : searchQuery.trim() !== "" ? (
          <div className="col-span-full text-center py-12">
            <p className="text-text">No notes match your search.</p>
          </div>
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-text">
              You don't have any notes yet. Create one to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesGrid;
