import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, MapPinPen, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGenerateLearningPath } from "../../hooks/queries/useLearningPath";
import toast from "react-hot-toast";
import LearningPathView from "./LearningPathView";

interface LearningPathModalProps {
  spaceId: string;
  trigger: React.ReactNode;
}

export const LearningPathModal = ({ spaceId, trigger }: LearningPathModalProps) => {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const { mutateAsync: generatePath, isPending } = useGenerateLearningPath();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    try {
      await generatePath({ spaceId, topic });
      toast.success("Learning path generated!");
      setTopic("");
      setOpen(false); // Can optionally stay open to show it, or we show it somewhere else.
    } catch (error) {
      toast.error("Failed to generate learning path");
    }
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
        <AnimatePresence>
          {open && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] glass-panel focus:outline-none"
                >
                  <div className="flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-white/20 dark:border-white/10 rounded-t-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                          <MapPinPen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <Dialog.Title className="text-lg font-semibold text-text">
                          Create Learning Path
                        </Dialog.Title>
                      </div>
                      <Dialog.Close asChild>
                        <button className="text-text-secondary hover:text-text transition-colors p-2 rounded-full hover:bg-white/50 dark:hover:bg-slate-700/50">
                          <X className="w-5 h-5" />
                        </button>
                      </Dialog.Close>
                    </div>

                    {/* Body */}
                    <div className="p-6 flex flex-col gap-5">
                      <p className="text-sm text-text-secondary leading-relaxed">
                        What topic would you like to learn? We'll create a structured, step-by-step roadmap from beginner to advanced based on this space.
                      </p>
                      <input
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. React Hooks"
                        className="w-full bg-white/50 dark:bg-slate-800/50 border border-border/50 rounded-xl p-4 text-sm text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-500/50 backdrop-blur-sm transition-all"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleGenerate();
                        }}
                      />

                      <div className="flex justify-end pt-4">
                        <button
                          onClick={handleGenerate}
                          disabled={isPending || !topic.trim()}
                          className="btn-3d-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                          {isPending ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin mr-2" />
                              Generating...
                            </>
                          ) : (
                            "Generate Path"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </>
  );
};
