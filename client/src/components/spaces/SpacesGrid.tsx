import { Link } from "react-router-dom";
import SpaceMenu from "./SpaceMenu";
import { useSpaces } from "../../hooks/queries/useSpaces";
import { useState, useCallback } from "react";
import NewSpaceButton from "./NewSpaceButton";
import { ISpace } from "@thinkly/shared";
import SearchBar from "../ui/SearchBar";
import { ErrorState } from "../ui/ErrorState";
import { Clock, FileText } from "lucide-react";

const SpacesGrid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: Spaces = [],
    error: SpacesError,
    isLoading: isSpacesLoading,
    isRefetching,
    refetch,
  } = useSpaces(searchQuery);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  if (isSpacesLoading) {
    return (
      <div className="flex w-full items-center justify-center">
        <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="relative rounded-xl border border-border/50 bg-bg p-6 min-h-[160px] shadow-sm animate-pulse flex flex-col justify-between"
            >
              <div className="h-6 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 w-1/2 bg-neutral-100 dark:bg-neutral-900 rounded"></div>
                <div className="h-4 w-1/3 bg-neutral-100 dark:bg-neutral-900 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (SpacesError) {
    return (
      <ErrorState message={SpacesError.message} onRetry={() => refetch()} />
    );
  }

  const hasFilteredSpaces = Spaces.length > 0;

  return (
    <div className="space-y-8">
      <div className="flex justify-end mb-6">
        <div className="w-full max-w-xs">
          <SearchBar onSearch={handleSearch} placeholder="Search spaces..." />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <NewSpaceButton />

        {hasFilteredSpaces ? (
          Spaces.map((Space: ISpace) => (
            <div
              key={Space._id}
              className="group relative glass-panel p-5 hover:border-primary-500/50 transition-all duration-200 flex flex-col min-h-[160px]"
            >
              <Link
                to={`/spaces/${Space._id}`}
                className="flex-1 flex flex-col"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-text leading-tight pr-8 line-clamp-2">
                    {Space.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded">
                    Novice
                  </span>
                  <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded">
                    {Space.sourcesCount || 0} Sources
                  </span>
                </div>

                <div className="mt-auto space-y-4">
                  {/* 
                  <div>
                    <div className="flex justify-between text-xs mb-1 text-text-secondary">
                      <span>Mastery</span>
                      <span>15%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 w-[15%]"></div>
                    </div>
                  </div>
                  */}

                  <div className="flex items-center text-xs text-text-secondary font-medium">
                    <Clock className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                    <span>Last studied 2 days ago</span>
                  </div>
                </div>
              </Link>

              <div className="absolute top-4 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <SpaceMenu SpaceId={Space._id} />
              </div>
              <div className="absolute top-4 right-3 md:hidden">
                <SpaceMenu SpaceId={Space._id} />
              </div>
            </div>
          ))
        ) : searchQuery.trim() !== "" ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-dashed border-border">
            <p className="text-text-secondary text-lg">
              No spaces match "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-2 text-primary-500 hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="col-span-full sm:col-span-1 lg:col-span-2 xl:col-span-3 flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-primary-500/60" />
            </div>
            <h3 className="text-xl font-semibold text-text mb-2">
              No spaces yet
            </h3>
            <p className="text-text-secondary max-w-sm">
              You haven't created any spaces. Click the "Create New Space"
              button to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpacesGrid;
