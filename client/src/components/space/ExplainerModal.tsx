import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { X, Headphones, Loader2, Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGenerateExplainer } from "../../hooks/queries/useExplainers";
import toast from "react-hot-toast";
import { FISH_AUDIO_VOICES, VoicePersonaId } from "@thinkly/shared";

interface ExplainerModalProps {
  spaceId: string;
  trigger: React.ReactNode;
}

export const ExplainerModal = ({ spaceId, trigger }: ExplainerModalProps) => {
  const [open, setOpen] = useState(false);
  const [concept, setConcept] = useState("");
  const [voiceId, setVoiceId] = useState<VoicePersonaId>("hip");
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
                className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] glass-panel focus:outline-none"
              >
                <div className="flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-5 border-b border-white/20 dark:border-white/10 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <Headphones className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <Dialog.Title className="text-lg font-semibold text-text">
                        Create Audio Explainer
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
                      What concept from this space do you want explained? We'll
                      generate a concise, natural-sounding audio explanation to
                      help you grasp it.
                    </p>
                    <textarea
                      value={concept}
                      onChange={(e) => setConcept(e.target.value)}
                      placeholder="e.g. Explain how OAuth 2.0 works..."
                      className="w-full bg-white/50 dark:bg-slate-800/50 border border-border/50 rounded-xl p-4 text-sm text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none h-28 backdrop-blur-sm transition-all"
                    />

                    <div className="flex flex-col gap-2 relative">
                      <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                        Voice Persona
                      </label>
                      <Listbox value={voiceId} onChange={setVoiceId}>
                        <div className="relative mt-1">
                          <ListboxButton className="relative w-full cursor-pointer rounded-xl bg-white/50 dark:bg-slate-800/50 py-3.5 pl-4 pr-10 text-left border border-border/50 hover:border-primary-300 transition-colors focus:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/50 sm:text-sm backdrop-blur-sm">
                            <span className="block truncate font-medium text-text">
                              {
                                FISH_AUDIO_VOICES.find((v) => v.id === voiceId)
                                  ?.name
                              }
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                              <ChevronDown
                                className="h-4 w-4 text-text-secondary"
                                aria-hidden="true"
                              />
                            </span>
                          </ListboxButton>

                          <ListboxOptions className="absolute mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white py-2 text-base shadow-xl ring-1 ring-black/5 focus:outline-none sm:text-sm z-50">
                            {FISH_AUDIO_VOICES.map((voice) => (
                              <ListboxOption
                                key={voice.id}
                                className={({ focus }) =>
                                  `relative cursor-pointer select-none py-3 pl-11 pr-4 transition-colors ${
                                    focus
                                      ? "bg-primary-50 dark:bg-slate-700 text-primary-700 dark:text-primary-300"
                                      : "text-text hover:bg-white dark:hover:bg-slate-800"
                                  }`
                                }
                                value={voice.id}
                              >
                                {({ selected }) => (
                                  <>
                                    <span
                                      className={`block truncate ${selected ? "font-semibold text-primary-600 dark:text-primary-400" : "font-medium"}`}
                                    >
                                      {voice.name}
                                    </span>
                                    <span className="block truncate text-xs text-text-secondary mt-1">
                                      {voice.description}
                                    </span>
                                    {selected ? (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-primary-600 dark:text-primary-400">
                                        <Check
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </ListboxOption>
                            ))}
                          </ListboxOptions>
                        </div>
                      </Listbox>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={handleGenerate}
                        disabled={isPending || !concept.trim()}
                        className="btn-3d-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
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
