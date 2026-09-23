import React from "react";
import { formatDistanceToNow } from "date-fns";
import NoteListItem from "./NoteListItem";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useNotes } from "../../hooks/queries/useNotes";
import { ErrorState } from "../ui/ErrorState";

const RecentNotes = () => {
  const { data: notes = [], error: notesError, isLoading: isNotesLoading, refetch } = useNotes();

  const recentNotes = [...(notes || [])]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 3);

  if (isNotesLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-xl border-2 border-border/50"></div>
        ))}
      </div>
    );
  }

  if (notesError) {
    return <ErrorState message={notesError.message} onRetry={() => refetch()} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Recent Notes</h3>
        <Link
          to={"/notes"}
          className="flex items-center gap-1 group hover:underline font-medium text-primary-600 dark:text-primary-400"
        >
          <span>See all</span>
          <ArrowUpRight className="h-4 w-4 group-hover:-translate-y-0.5 duration-200 transition-transform" />
        </Link>
      </div>
      <div className="space-y-4">
        {recentNotes.length > 0 ? (
          recentNotes.map((note) => (
            <NoteListItem
              key={note._id}
              id={note._id}
              title={note.title}
              sourceCount={note.sources?.length || 0}
              updatedAt={formatDistanceToNow(new Date(note.updatedAt), {
                addSuffix: true,
              })}
            />
          ))
        ) : (
          <div className="p-6 text-center border-2 border-dashed border-border/50 rounded-xl">
            <p className="text-text-secondary">
              No notes yet. Create your first note to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentNotes;
