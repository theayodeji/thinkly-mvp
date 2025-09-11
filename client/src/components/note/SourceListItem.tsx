import { NotebookText, Globe, Text, Image } from "lucide-react";
import { Source } from "../../shared/types/source";
import { JSX } from "react";

const SourceListItem = ({ source }: { source: Source }): JSX.Element => {
  return (
    <div className="flex items-center gap-3 rounded-lg py-2 px-3 hover:bg-secondary-500/30">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary-400/30">
        {source.type === "pdf" && <NotebookText />}
        {source.type === "website" && <Globe />}
        {source.type === "text" && <Text />}
        {source.type === "image" && <Image />}
      </div>
      <div>
        <p className="font-medium text-gray-800 truncate">
          {source.name || source.file_url || "Untitled Source"}
        </p>
        <p className="text-sm text-dark">
          {source.type[0].toUpperCase() + source.type.slice(1)}
        </p>
      </div>
    </div>
  );
};

export default SourceListItem;
