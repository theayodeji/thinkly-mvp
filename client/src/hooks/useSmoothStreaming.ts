import { useEffect, useRef, useState } from "react";

/**
 * Takes a target text that may grow over time (like from an SSE stream)
 * and smoothly increments the displayed text character by character.
 */
export function useSmoothStreaming(targetText: string, speedMs = 500, charsPerTick = 8) {
  const [displayedText, setDisplayedText] = useState("");
  const targetTextRef = useRef(targetText);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    targetTextRef.current = targetText;
    
    // If target text was reset or cleared, reset our state
    if (!targetText) {
      setDisplayedText("");
      currentIndexRef.current = 0;
    }
  }, [targetText]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndexRef.current < targetTextRef.current.length) {
        currentIndexRef.current = Math.min(
          currentIndexRef.current + charsPerTick,
          targetTextRef.current.length
        );
        setDisplayedText(targetTextRef.current.substring(0, currentIndexRef.current));
      }
    }, speedMs);

    return () => clearInterval(interval);
  }, [speedMs, charsPerTick]); // Do NOT include targetText, otherwise interval resets constantly

  const isCaughtUp = displayedText.length === targetText.length;

  return { displayedText, isCaughtUp };
}
