import React, { useEffect } from "react";
import { useNoteStore } from "../../store/noteStore";
import { formatDistanceToNow } from "date-fns";
import NoteListItem from "./NoteListItem";
import LearningProgress from "./LearningProgress";
import Notifications from "./Notifications";
import PomodoroTimer from "./PomodoroTimer";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const RecentNotes = () => {
  const { notes, isNotesLoading, getNotes } = useNoteStore();

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  // Get the 3 most recent notes, sorted by updatedAt
  const recentNotes = [...(notes || [])]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 3);

  if (isNotesLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-4">
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-muted/20 animate-pulse rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-4">
      <div className="lg:col-span-2 space-y-8">
        <div>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Recent Notes</h3>
            <Link to={"/notes"} className="flex items-center group hover:underline">
              <span>See all</span>
              <ArrowUpRight className="text-primary-500 inline h-5 w-5 group-hover:-translate-y-0.5 duration-200 transition-transform" />
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
              <p className="text-muted-foreground">
                No notes yet. Create your first note to get started!
              </p>
            )}
          </div>
        </div>

        <LearningProgress />
      </div>

      <div className="space-y-8">
        <PomodoroTimer />
        <Notifications />
      </div>
    </div>
  );
};

export default RecentNotes;
