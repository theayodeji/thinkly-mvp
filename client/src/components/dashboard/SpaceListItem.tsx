import React from 'react';
import { FileText, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

type SpaceListItemProps = {
  id: string;
  title: string;
  sourceCount: number;
  updatedAt: string;
};

const SpaceListItem: React.FC<SpaceListItemProps> = ({ id, title, sourceCount, updatedAt }) => {
  return (
    <div className="group relative bg-bg border-2 border-border/50 hover:border-primary-500 transition-colors duration-300 rounded-xl flex items-center p-4 shadow-sm">
      <Link to={`/spaces/${id}`} className="absolute inset-0 z-0"></Link>
      <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 mr-4 z-10">
        <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
      </div>
      <div className="flex-1 min-w-0 pr-4 z-10 pointer-events-none">
        <p className="font-bold text-lg text-text truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{title}</p>
        <p className="text-sm font-medium text-text-secondary mt-1">
          {sourceCount} {sourceCount === 1 ? 'source' : 'sources'} &bull; Finalized
        </p>
      </div>
      <div className="flex items-center gap-6 z-10">
        <span className="text-xs font-semibold text-text-secondary whitespace-nowrap hidden sm:block">
          {updatedAt}
        </span>
        <button className="text-text-secondary hover:text-text p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative z-20">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SpaceListItem;
