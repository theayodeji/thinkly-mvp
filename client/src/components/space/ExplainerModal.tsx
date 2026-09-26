import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Headphones, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGenerateExplainer } from "../../hooks/queries/useExplainers";
import toast from "react-hot-toast";

interface ExplainerModalProps {
  spaceId: string;
  trigger: React.ReactNode;
}

export const ExplainerModal = ({ spaceId, trigger }: ExplainerModalProps) => {
  const [open, setOpen] = useState(false);
  const [concept, setConcept] = useState("");
  const [voiceId, setVoiceId] = useState<"hip" | "robotty">("hip");
  const { mutateAsync: generateExplainer, isPending } = useGenerateExplainer();

  const handleGenerate = async () => {
    if (!concept.trim()) {
      toast.error("Please enter a concept");
      return;
    }

    try {
      await generateExplainer({ spaceId, concept, voiceId });
      toast.success("Audio explainer is generating!");
      setConcept("");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to generate explainer");
    }
  };

  return (
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
                className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-bg border border-border/50 rounded-2xl shadow-xl overflow-hidden focus:outline-none"
              >
                <div className="flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 bg-neutral-50/50 dark:bg-neutral-900/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <Headphones className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <Dialog.Title className="text-base font-semibold text-text">
                        Create Audio Explainer
                      </Dialog.Title>
                    </div>
                    <Dialog.Close asChild>
                      <button className="text-text-secondary hover:text-text transition-colors p-1 rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-800">
                        <X className="w-5 h-5" />
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col gap-4">
                    <p className="text-sm text-text-secondary">
                      What concept from this space do you want explained? We'll generate a reassuring 90-second audio clip to help you grasp it.
                    </p>
                    <textarea
                      value={concept}
                      onChange={(e) => setConcept(e.target.value)}
                      placeholder="e.g. Action potentials in neurons..."
                      className="w-full bg-transparent border border-border/50 rounded-xl p-3 text-sm text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none h-24"
                    />

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Voice Persona</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setVoiceId("hip")}
                          className={`p-3 rounded-xl border flex flex-col gap-1 items-start text-left transition-colors ${
                            voiceId === "hip" 
                              ? "border-primary-500 bg-primary-500/5 dark:bg-primary-500/10" 
                              : "border-border/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                          }`}
                        >
                          <span className={`text-sm font-medium ${voiceId === "hip" ? "text-primary-600 dark:text-primary-400" : "text-text"}`}>
                            Chloe (Hip)
                          </span>
                          <span className="text-xs text-text-secondary">Casual, modern & energetic</span>
                        </button>
                        <button
                          onClick={() => setVoiceId("robotty")}
                          className={`p-3 rounded-xl border flex flex-col gap-1 items-start text-left transition-colors ${
                            voiceId === "robotty" 
                              ? "border-primary-500 bg-primary-500/5 dark:bg-primary-500/10" 
                              : "border-border/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                          }`}
                        >
                          <span className={`text-sm font-medium ${voiceId === "robotty" ? "text-primary-600 dark:text-primary-400" : "text-text"}`}>
                            Nova (Robotty)
                          </span>
                          <span className="text-xs text-text-secondary">Precise, clear & technical</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleGenerate}
                        disabled={isPending || !concept.trim()}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          "Generate Audio"
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
  );
};
