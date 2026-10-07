import React from "react";
import { Copy, WandSparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { useParams } from "react-router-dom";
import { useSpace } from "../../hooks/queries/useSpaces";
import toast from "react-hot-toast";
import { preprocessMath } from "../../shared/utils/math";

const copySummary = (summary: string) => {
  navigator.clipboard.writeText(summary);
  toast.success("Summary copied to clipboard");
};

const SummaryBlock = () => {
  const { id } = useParams<{ id: string }>();
  const { data: currentSpace, isLoading: isActionLoading } = useSpace(id || "");

  const processedSummary = React.useMemo(
    () => preprocessMath(currentSpace?.summary || ""),
    [currentSpace?.summary]
  );

  if (isActionLoading)
    return (
      <div className="flex gap-4 p-4 max-w-3xl">
        <div className="w-8 h-8 rounded-full bg-primary-600/20 animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="animate-pulse h-4 bg-border/50 rounded w-1/4" />
          <div className="animate-pulse h-24 bg-border/50 rounded w-full" />
        </div>
      </div>
    );

  if (!currentSpace?.summary) return null;

  return (
    <div className="flex gap-4 md:p-4 max-w-3xl mb-4 group">
      <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 shadow-md">
        <WandSparkles className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-text text-sm">
            Thinkly Summary
          </span>
        </div>
        <div className="prose prose-sm prose-neutral dark:prose-invert prose-primary max-w-none text-text/90 leading-relaxed text-sm">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              strong: ({ ...props }) => (
                <strong
                  className="font-semibold text-primary-600 dark:text-primary-400"
                  {...props}
                />
              ),
              ul: ({ ...props }) => (
                <ul
                  className="list-disc pl-4 sm:pl-5 space-y-1.5 my-2 text-text/90 marker:text-primary-500"
                  {...props}
                />
              ),
              ol: ({ ...props }) => (
                <ol
                  className="list-decimal pl-4 sm:pl-5 space-y-1.5 my-2 text-text/90 marker:text-primary-500 font-medium"
                  {...props}
                />
              ),
              li: ({ ...props }) => (
                <li className="pl-0.5 sm:pl-1 leading-relaxed" {...props} />
              ),
              p: ({ ...props }) => (
                <p className="mb-3 last:mb-0 leading-relaxed" {...props} />
              ),
              h2: ({ ...props }) => (
                <h2
                  className="text-lg font-bold mt-4 mb-2 text-text"
                  {...props}
                />
              ),
              h3: ({ ...props }) => (
                <h3
                  className="text-md font-bold mt-3 mb-2 text-text"
                  {...props}
                />
              ),
              blockquote: ({ ...props }) => (
                <blockquote
                  className="border-l-4 border-primary-500 pl-4 py-1 italic bg-neutral-100 dark:bg-neutral-800/50 rounded-r-lg my-3"
                  {...props}
                />
              ),
            }}
          >
            {processedSummary}
          </ReactMarkdown>
        </div>
        <div className="flex items-center gap-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => copySummary(currentSpace.summary || "")}
            className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text transition-colors"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Copy</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryBlock;
