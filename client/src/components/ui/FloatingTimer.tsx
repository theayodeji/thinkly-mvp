import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, RefreshCw } from "lucide-react";
import { usePomodoro } from "../../hooks/usePomodoro";
import type { TimerMode } from "../../contexts/PomodoroContext";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

const FloatingTimer = () => {
  const { timeLeft, isActive, mode, toggleTimer, resetTimer, formatTime } =
    usePomodoro();
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const timerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!timerRef.current) return;

    const rect = timerRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setIsDragging(true);
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const modeColors = {
    work: "bg-red-500",
    break: "bg-green-500",
  };

  if (!isActive && timeLeft === 25 * 60) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.2 , ease: "easeInOut"}}
        ref={timerRef}
        className={clsx(
          "w-48 h-48 fixed z-50 rounded-full shadow-lg transition-all duration-300 overflow-hidden transform origin-center",
          isExpanded ? "scale-100" : "scale-37",
          modeColors[mode as TimerMode]
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
        onClick={() => !isDragging && setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-white">
            <div className="text-2xl font-bold mb-2">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm mb-4">
              {mode === "work" ? "Focus Time" : "Break Time"}
            </div>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTimer();
                }}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                aria-label={isActive ? "Pause" : "Start"}
              >
                {isActive ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetTimer();
                }}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                aria-label="Reset"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-5xl font-bold">{formatTime(timeLeft)}</div>
          </div>
        )}
        {!isExpanded && <p className="absolute bottom-2 left-2 text-dark text-sm">Drag to move</p> }
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingTimer;
