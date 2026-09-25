import React from "react";
import SpacesGrid from "../../components/spaces/SpacesGrid";
import { useAuth } from "../../hooks/useAuth";
import { FolderKanban } from "lucide-react";

const SpacesList = () => {
  const { user, loading } = useAuth();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {loading ? (
        <div className="flex flex-col space-y-4 mb-8 animate-pulse">
          <div className="w-1/3 h-8 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
          <div className="w-1/4 h-4 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
        </div>
      ) : (
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary-500/10 dark:bg-primary-500/20 rounded-lg">
                <FolderKanban className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h1 className="text-3xl font-bold text-text">
                <span className="text-primary-600 dark:text-primary-400">{user?.name?.split(" ")[0]}</span>'s Study Spaces
              </h1>
            </div>
            <p className="text-text-secondary">
              Organize your knowledge, notes, and study materials into dedicated spaces.
            </p>
          </div>
        </div>
      )}
      
      <SpacesGrid />
    </div>
  );
};

export default SpacesList;
