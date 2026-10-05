import React from "react";
import { Headphones, Loader2, Trash2, RefreshCw } from "lucide-react";
import { IAudioExplainer } from "@thinkly/shared";
import { useDeleteExplainer, useRetryExplainer } from "../../hooks/queries/useExplainers";

interface Props {
  explainer: IAudioExplainer;
}

const AudioExplainerCard = ({ explainer }: Props) => {
  const { mutate: deleteExplainer, isPending: isDeleting } = useDeleteExplainer();
  const { mutate: retryExplainer, isPending: isRetrying } = useRetryExplainer();

  return (
    <div className="glass-panel border-none shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-lg rounded-2xl p-3 flex items-start gap-3 text-left transition-all duration-300 group">
      <div className="mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-primary-400/10 to-primary-600/10">
        <Headphones className="w-5 h-5 text-primary-600 dark:text-primary-400" />
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-center min-h-[40px]">
        <div className="flex items-center justify-between gap-2 w-full">
          <h4 className="text-sm font-semibold text-text truncate">
            {explainer.concept}
          </h4>
          
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => deleteExplainer(explainer._id)}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-600 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {explainer.status === "processing" ? (
          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-text-secondary">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Generating audio...</span>
          </div>
        ) : explainer.status === "error" ? (
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-red-500 line-clamp-1">Failed to generate audio</p>
            <button
              onClick={() => retryExplainer(explainer._id)}
              disabled={isRetrying}
              className="text-text-secondary hover:text-text transition-colors p-1"
              title="Retry"
            >
              {isRetrying ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
            </button>
          </div>
        ) : (
          <div className="mt-3 mb-1">
            {explainer.audioUrl && (
              <audio 
                controls
                autoPlay={false}
                src={explainer.audioUrl} 
                className="w-full h-8"
                controlsList="nodownload noplaybackrate"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioExplainerCard;
