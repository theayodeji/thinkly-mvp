import React, { useState, useEffect } from "react";
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
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { FISH_AUDIO_VOICES, VoicePersonaId } from "@thinkly/shared";

import { usePermissionsAndLimits, MeteredMetric } from "../../hooks/usePermissionsAndLimits";
import { useSpaceSources, useSpace } from "../../hooks/queries/useSpaces";

interface ExplainerModalProps {
  spaceId: string;
  trigger: React.ReactNode;
}

export const ExplainerModal = ({ spaceId, trigger }: ExplainerModalProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [concept, setConcept] = useState("");
  
  const userDefaultVoice = (user?.preferences?.defaultVoice as VoicePersonaId) || "hip";
  const [voiceId, setVoiceId] = useState<VoicePersonaId>(userDefaultVoice);
  
  const { mutateAsync: generateExplainer, isPending } = useGenerateExplainer();

  const { getLimitStatus, triggerLimitModal } = usePermissionsAndLimits();
  const explainerLimitStatus = getLimitStatus(MeteredMetric.AUDIO_EXPLAINERS);

  // Sync default voice preference when modal opens or user preferences update
  useEffect(() => {
    if (open && user?.preferences?.defaultVoice) {
      setVoiceId(user.preferences.defaultVoice as VoicePersonaId);
    }
  }, [open, user?.preferences?.defaultVoice]);

  const { data: sources, isLoading: isSourcesLoading } = useSpaceSources(spaceId);
  const { data: space } = useSpace(spaceId);
  const hasContent = Boolean(space?.content?.trim() || (sources && sources.length > 0));

  const handleGenerate = async () => {
    if (!isSourcesLoading && !hasContent) {
      toast.error("Please add a source to this space before generating an Audio Explainer.");
      setOpen(false);
      return;
    }

    if (explainerLimitStatus.isReached || explainerLimitStatus.isLocked) {
      triggerLimitModal("You've reached your daily limit for Audio Explainers.");
      setOpen(false);
      return;
    }

    if (!concept.trim()) {
      toast.error("Please enter a concept");
      return;
    }

    try {
      await generateExplainer({ spaceId, concept, voiceId });
      toast.success("Audio explainer is generating!");
      setConcept("");
      setOpen(false);
    } catch (error: any) {
      const isLimitError = error?.response?.status === 403;
      if (isLimitError) {
        triggerLimitModal(error?.response?.data?.message || "Audio limit reached.");
        setOpen(false);
      } else {
        // Keep modal open on network or other errors so the user can retry
        toast.error(error?.response?.data?.error || "Failed to generate explainer. Please try again.");
      }
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
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl focus:outline-none p-0 overflow-visible"
              >
                <div className="flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950/60 flex items-center justify-center">
                        <Headphones className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <Dialog.Title className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        Create Audio Explainer
                      </Dialog.Title>
                    </div>
                    <Dialog.Close asChild>
                      <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                        <X className="w-5 h-5" />
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col gap-5">
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      What concept from this space do you want explained? We&apos;ll
                      generate a concise, natural-sounding audio explanation to
                      help you grasp it.
                    </p>
                    <textarea
                      value={concept}
                      onChange={(e) => setConcept(e.target.value)}
                      placeholder="e.g. Explain how OAuth 2.0 works..."
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none h-24 transition-all"
                    />

                    <div className="flex flex-col gap-1.5 relative">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Voice Persona
                      </label>
                      <Listbox value={voiceId} onChange={setVoiceId}>
                        <div className="relative">
                          <ListboxButton className="relative w-full cursor-pointer rounded-xl bg-slate-50 dark:bg-slate-800/80 py-3 pl-4 pr-10 text-left border border-slate-200 dark:border-slate-700 hover:border-primary-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 text-sm">
                            <span className="block truncate font-medium text-slate-900 dark:text-slate-100">
                              {
                                FISH_AUDIO_VOICES.find((v) => v.id === voiceId)
                                  ?.name
                              }
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                              <ChevronDown
                                className="h-4 w-4 text-slate-400"
                                aria-hidden="true"
                              />
                            </span>
                          </ListboxButton>

                          {/* Dropdown content opens upward (bottom-full) to stay inside modal viewport */}
                          <ListboxOptions className="absolute bottom-full mb-2 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 text-sm shadow-2xl focus:outline-none z-[100]">
                            {FISH_AUDIO_VOICES.map((voice) => (
                              <ListboxOption
                                key={voice.id}
                                className={({ active }) =>
                                  `relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors ${
                                    active
                                      ? "bg-primary-50 dark:bg-slate-700/80 text-primary-700 dark:text-primary-300"
                                      : "text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                  }`
                                }
                                value={voice.id}
                              >
                                {({ selected }) => (
                                  <>
                                    <span
                                      className={`block truncate ${selected ? "font-bold text-primary-600 dark:text-primary-400" : "font-medium text-slate-900 dark:text-slate-100"}`}
                                    >
                                      {voice.name}
                                    </span>
                                    <span className="block truncate text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                      {voice.description}
                                    </span>
                                    {selected ? (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600 dark:text-primary-400">
                                        <Check
                                          className="h-4 w-4"
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

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleGenerate}
                        disabled={isPending || !concept.trim()}
                        className="btn-3d-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none w-full sm:w-auto py-2.5"
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
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
