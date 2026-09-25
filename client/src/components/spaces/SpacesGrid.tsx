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
    refetch
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
    return <ErrorState message={SpacesError.message} onRetry={() => refetch()} />;
  }

  const hasFilteredSpaces = Spaces.length > 0;

  return (
    <div className="space-y-8">
      <div className="w-full max-w-md">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search spaces..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <NewSpaceButton />
        
        {hasFilteredSpaces ? (
          Spaces.map((Space: ISpace) => (
            <div
              key={Space._id}
              className="group relative rounded-xl bg-bg border border-border/50 p-5 shadow-sm hover:shadow-md hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all duration-200 flex flex-col min-h-[160px]"
            >
              <Link to={`/spaces/${Space._id}`} className="flex-1 flex flex-col">
                <h3 className="font-semibold text-lg text-text leading-tight mb-3 pr-8 line-clamp-2">
                  {Space.title}
                </h3>
                
                <div className="mt-auto space-y-2">
                  <div className="flex items-center text-sm text-text-secondary">
                    <Clock className="w-4 h-4 mr-2 opacity-70" />
                    <span>{new Date(Space.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center text-sm text-text-secondary">
                    <FileText className="w-4 h-4 mr-2 opacity-70" />
                    <span>{Space.sourcesCount || 0} source{(Space.sourcesCount || 0) !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </Link>
              
              <div className="absolute top-4 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <SpaceMenu SpaceId={Space._id} />
              </div>
              {/* Show the menu icon permanently on mobile devices */}
              <div className="absolute top-4 right-3 md:hidden">
                <SpaceMenu SpaceId={Space._id} />
              </div>
            </div>
          ))
        ) : searchQuery.trim() !== "" ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-dashed border-border">
            <p className="text-text-secondary text-lg">No spaces match "{searchQuery}"</p>
            <button onClick={() => setSearchQuery("")} className="mt-2 text-primary-500 hover:underline">Clear search</button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SpacesGrid;
