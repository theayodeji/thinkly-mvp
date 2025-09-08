import React from "react";
import NotesGrid from "../../components/notes/NotesGrid";
import { useAuth } from "../../hooks/useAuth";

const NotesList: React.FC = () => {
  const { user, loading } = useAuth();

  return (
    <div className="p-6 w-full max-w-5xl mx-auto">
      {loading ? (
        <div className="flex items-center space-x-4 border-b border-gray-200 pb-4 mb-6 animate-pulse">
          <div className="w-1/3 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ) : (
        <h1 className="text-3xl font-bold mb-6">
          <span className="text-primary-500">{user?.name?.split(" ")[0]}</span>'s Notes
        </h1>
      )}
      <NotesGrid />
    </div>
  );
};

export default NotesList;
