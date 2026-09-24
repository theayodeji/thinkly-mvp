import { NotebookText, Globe, Text, Image } from "lucide-react";
import { ISource, SourceType } from "@thinkly/shared";
import { JSX } from "react";

const SourceListItem = ({ source }: { source: ISource }): JSX.Element => {
  return (
    <div
      className="bg-bg hover:bg-neutral-100 dark:bg-transparent dark:hover:bg-neutral-800/80 border border-border/50 rounded-xl p-3 flex items-start gap-3 text-left transition-colors cursor-pointer group mb-2"
      aria-label={`${source.name || source.file_url || "Untitled Source"} - Click to view details`}
    >
      <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary-600/10 text-primary-600 dark:text-primary-400">
        {source.type === SourceType.FILE_PDF && <NotebookText className="w-4 h-4" />}
        {source.type === SourceType.LINK && <Globe className="w-4 h-4" />}
        {source.type === SourceType.TEXT && <Text className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-text truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {source.name || source.file_url || "Untitled Source"}
        </h4>
        <p className="text-xs text-text-secondary mt-0.5">
          {source.type[0].toUpperCase() + source.type.slice(1)}
        </p>
      </div>
    </div>
  );
};

export default SourceListItem;
