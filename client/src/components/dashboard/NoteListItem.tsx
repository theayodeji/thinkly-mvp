import React from 'react';
import { FileText, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

type NoteListItemProps = {
    id: string;
  title: string;
  sourceCount: number;
  updatedAt: string;
};

const NoteListItem: React.FC<NoteListItemProps> = ({ id, title, sourceCount, updatedAt }) => {
  return (
    <Link to={`/notes/${id}`} className="card px-4 py-6 rounded-md bg-bg dark:hover:bg-neutral/30 duration-300 flex items-center gap-4 hover:shadow-md transition-[background-color, shadow]">
      <div className="md:w-16 md:h-16 w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
        <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{title}</p>
        <p className="text-sm text-muted-foreground">
          {sourceCount} {sourceCount === 1 ? 'source' : 'sources'}
        </p>
      </div>
      <div className="text-sm text-muted-foreground whitespace-nowrap ml-2">
        {updatedAt}
      </div>
      <button className="text-muted-foreground hover:text-foreground">
        <MoreVertical className="w-5 h-5" />
      </button>
    </Link>
  );
};

export default NoteListItem;
