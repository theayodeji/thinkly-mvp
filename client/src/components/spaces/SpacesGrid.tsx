import { Link } from "react-router-dom";
import SpaceMenu from "./SpaceMenu";
import { useSpaces } from "../../hooks/queries/useSpaces";
import { useState, useMemo, useCallback } from "react";
import NewSpaceButton from "./NewSpaceButton";
import { ISpace } from "@thinkly/shared";
import SearchBar from "../ui/SearchBar";
import { ErrorState } from "../ui/ErrorState";

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

  if (SpacesError) {
    return <ErrorState message={SpacesError.message} onRetry={() => refetch()} />;
  }

  const hasFilteredSpaces = Spaces.length > 0;

  return (
    <div className="space-y-6">
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search Spaces by title or content..."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 auto-rows-fr gap-4">
        <NewSpaceButton />
        {hasFilteredSpaces ? (
          Spaces.map((Space: ISpace) => (
            <div
              key={Space._id}
              className="relative rounded-md bg-bg border border-neutral/40 p-4 shadow-lg drop-shadow-xl hover:bg-neutral/50 transition-colors duration-300"
            >
              <Link to={`/spaces/${Space._id}`} className="h-full flex flex-col">
                <p className="font-semibold text-xl mb-2 w-[80%]">
                  {Space.title.slice(0, 40) +
                    (Space.title.length > 40 ? "..." : "")}
                </p>
                <div>
                  <p className="text-sm text-text">
                    Created at {new Date(Space.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-text">
                    {Space.sourcesCount || 0} sources
                  </p>
                </div>
              </Link>
              <SpaceMenu SpaceId={Space._id} />
            </div>
          ))
        ) : searchQuery.trim() !== "" ? (
          <div className="col-span-full text-center py-12">
            <p className="text-text">No Spaces match your search.</p>
          </div>
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-text">
              You don't have any Spaces yet. Create one to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpacesGrid;
