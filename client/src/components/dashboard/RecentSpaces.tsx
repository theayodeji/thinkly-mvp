import React from "react";
import { formatDistanceToNow } from "date-fns";
import SpaceListItem from "./SpaceListItem";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useSpaces } from "../../hooks/queries/useSpaces";
import { ErrorState } from "../ui/ErrorState";

const RecentSpaces = () => {
  const { data: Spaces = [], error: SpacesError, isLoading: isSpacesLoading, refetch } = useSpaces();

  const recentSpaces = [...(Spaces || [])]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 3);

  if (isSpacesLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-xl border-2 border-border/50"></div>
        ))}
      </div>
    );
  }

  if (SpacesError) {
    return <ErrorState message={SpacesError.message} onRetry={() => refetch()} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Recent Spaces</h3>
        <Link
          to={"/spaces"}
          className="flex items-center gap-1 group hover:underline font-medium text-primary-600 dark:text-primary-400"
        >
          <span>See all</span>
          <ArrowUpRight className="h-4 w-4 group-hover:-translate-y-0.5 duration-200 transition-transform" />
        </Link>
      </div>
      <div className="space-y-4">
        {recentSpaces.length > 0 ? (
          recentSpaces.map((Space) => (
            <SpaceListItem
              key={Space._id}
              id={Space._id}
              title={Space.title}
              sourceCount={Space.sourcesCount || 0}
              updatedAt={formatDistanceToNow(new Date(Space.updatedAt), {
                addSuffix: true,
              })}
            />
          ))
        ) : (
          <div className="p-6 text-center border-2 border-dashed border-border/50 rounded-xl">
            <p className="text-text-secondary">
              No Spaces yet. Create your first Space to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentSpaces;
