import { memo } from 'react';
import NoSource from "./NoSource";
import SourceListItem from "./SourceListItem";
import { useParams } from "react-router-dom";
import { useNote } from "../../hooks/queries/useNotes";

const SourceList = memo(({ setIsSourceModalOpen }: { setIsSourceModalOpen: (isOpen: boolean) => void }) => {
  const { id } = useParams<{ id: string }>();
  const { data: currentNote, isFetching: isActionLoading } = useNote(id || "");

  if (currentNote?.sources?.length === 0) {
    return <NoSource setIsSourceModalOpen={setIsSourceModalOpen} />;
  }

  if (isActionLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-md animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {currentNote?.sources?.map((source: any) => (
        <SourceListItem key={source._id} source={source} />
      ))}
    </div>
  );
});

SourceList.displayName = 'SourceList';

export default SourceList;
