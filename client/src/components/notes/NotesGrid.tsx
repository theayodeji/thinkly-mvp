import { Link } from "react-router-dom";
import NoteMenu from "./NoteMenu";
import { useNoteStore } from "../../store/noteStore";
import { useEffect, useState, useMemo, useCallback } from "react";
import NewNoteButton from "./NewNoteButton";
import { Note } from "../../shared/types/note";
import SearchBar from "../ui/SearchBar";

const NotesGrid = () => {
  const { getNotes, notes, notesError, isNotesLoading } = useNoteStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter notes based on search query with memoization
  const searchResults = useMemo(() => {
    if (!notes) return [];
    if (!searchQuery.trim()) return notes;
    
    // TODO: Move this into the hook
    const query = searchQuery.toLowerCase();
    return notes.sort((a, b) => {
      const aMatchesTitle = a.title?.toLowerCase().includes(query) ?? false;
      const bMatchesTitle = b.title?.toLowerCase().includes(query) ?? false;
      if (aMatchesTitle && !bMatchesTitle) return -1;
      if (!aMatchesTitle && bMatchesTitle) return 1;
      return a.title?.toLowerCase().localeCompare(b.title?.toLowerCase()) ?? 1;
    }).filter(note => 
      (note.title?.toLowerCase().includes(query) ||
       note.content?.toLowerCase().includes(query))
    );
  }, [notes, searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  if (isNotesLoading) {
    return (
      <div className="flex w-full items-center justify-center">
        <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 grid-rows-[1fr_1fr_1fr] gap-4">
          {[...Array(9)].map((_, index) => (
            <div key={index} className="relative rounded-md shadow-lg drop-shadow-xl animate-pulse">
              <div className="h-[140px] w-full bg-neutral/20 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (notesError) return <p className="text-red-500">{notesError.message}</p>;
  
  const hasNotes = notes.length > 0;
  const hassearchResults = searchResults.length > 0;

  return (
    <div className="space-y-6">
      <SearchBar 
        onSearch={handleSearch} 
        placeholder="Search notes by title or content..."
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 auto-rows-fr gap-4">
        <NewNoteButton />
        {hassearchResults ? (
          searchResults.map((note: Note) => (
            <div key={note._id} className="relative rounded-md bg-bg border border-neutral/40 p-4 shadow-lg drop-shadow-xl hover:bg-neutral/50 transition-colors duration-300">
              <Link
                to={`/notes/${note._id}`}
                className="h-full flex flex-col"
              >
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
              <NoteMenu noteId={note._id}/>
            </div>
          ))
        ) : hasNotes ? (
          <div className="col-span-full text-center py-12">
            <p className="text-text">No notes match your search.</p>
          </div>
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-text">You don't have any notes yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesGrid;
