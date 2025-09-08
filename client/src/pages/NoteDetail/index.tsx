import React from 'react';
import { useParams } from 'react-router-dom';
import NotePageHeader from '../../components/note/NotePageHeader';
import SourcesAside from '../../components/note/SourcesAside';

const NoteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-[calc(100vh-4.1rem)]">
      <NotePageHeader />
      <div className="flex wrapper pt-4 gap-4">
        <div className="lg:flex-[1.1] p-4  rounded-md overflow-y-auto">
          <SourcesAside />
        </div>
        <div className="lg:flex-2 p-4 bg-primary-400 min-h-32 rounded-md overflow-y-auto"></div>
      </div>
    </div>
  );
};

export default NoteDetail;
