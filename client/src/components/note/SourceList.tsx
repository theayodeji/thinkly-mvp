import { memo } from 'react';
import NoSource from "./NoSource";
import SourceListItem from "./SourceListItem";
import { useNoteStore } from "../../store/noteStore";

const SourceList = memo(({ setIsSourceModalOpen }: { setIsSourceModalOpen: (isOpen: boolean) => void }) => {
  const { currentNote, isActionLoading } = useNoteStore();

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
      {currentNote?.sources?.map((source) => (
        <SourceListItem key={source._id} source={source} />
      ))}
    </div>
  );
});

SourceList.displayName = 'SourceList';

export default SourceList;
