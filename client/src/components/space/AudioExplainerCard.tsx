import React, { useState } from "react";
import { Headphones, Loader2, Play, Pause, Trash2 } from "lucide-react";
import { IAudioExplainer } from "@thinkly/shared";
import { useDeleteExplainer } from "../../hooks/queries/useExplainers";

interface Props {
  explainer: IAudioExplainer;
}

const AudioExplainerCard = ({ explainer }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const { mutate: deleteExplainer, isPending: isDeleting } = useDeleteExplainer();

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="bg-bg hover:bg-neutral-100 dark:bg-transparent dark:hover:bg-neutral-800/80 border border-border/50 rounded-xl p-3 flex items-start gap-3 text-left transition-colors group">
      <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-amber-500/10 text-amber-600 dark:text-amber-400">
        <Headphones className="w-4 h-4" />
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-center h-8">
        <div className="flex items-center justify-between gap-2 w-full">
          <h4 className="text-sm font-semibold text-text truncate">
            {explainer.concept}
          </h4>
          
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {explainer.status === "ready" && (
              <button 
                onClick={togglePlay}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 p-1"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            )}
            
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
          <p className="text-xs text-red-500 mt-0.5 line-clamp-1">Failed to generate audio</p>
        ) : (
          <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">Audio ready</p>
        )}
      </div>

      {explainer.audioUrl && (
        <audio 
          ref={audioRef} 
          src={explainer.audioUrl} 
          onEnded={handleEnded} 
          className="hidden" 
        />
      )}
    </div>
  );
};

export default AudioExplainerCard;
