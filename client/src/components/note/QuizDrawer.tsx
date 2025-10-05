import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { BadgeQuestionMark, X } from "lucide-react";
import { useClose } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { CloseButtonWithWarning } from "./CloseButtonWithWarning";
import { useQuizStore } from "../../store/quizStore";

interface QuizDrawerProps {
  children?: React.ReactNode;
}

const QuizDrawer = ({ children }: QuizDrawerProps) => {
  const close = useClose();
  const [open, setIsOpen] = useState(false);
  const status = useQuizStore((s) => s.status);

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col gap-3 px-3 py-4 border-3 border-secondary-500/30 dark:border-secondary-500/10 rounded-md cursor-pointer hover:bg-secondary-400/10">
          <div className="flex gap-2 w-full">
            <BadgeQuestionMark className="w-6 h-6" />
            <p>Take Quiz</p>
          </div>
        </div>
      </DialogTrigger>

      <DialogPortal forceMount>
        <AnimatePresence>
          {open && (
            <DialogContent asChild forceMount>
              <motion.div
                initial={{ opacity: 0, y: 420 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 420 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed bottom-0 right-0 h-full w-full bg-bg shadow-lg p-6 flex flex-col z-50"
              >
                <div className="flex justify-between items-center mb-6">
                  <DialogTitle className="text-xl font-semibold">
                    Quiz
                  </DialogTitle>
                  {status === "started" ? (
                    <CloseButtonWithWarning onConfirm={() => setIsOpen(false)}>
                      <X className="rounded-full p-2 bg-bg-secondary hover:bg-bg-secondary/80  text-text-secondary w-10 h-10 cursor-pointer z-100" />
                    </CloseButtonWithWarning>
                  ) : (
                    <DialogClose asChild>
                      <X className="rounded-full p-2 bg-bg-secondary hover:bg-bg-secondary/80 text-text-secondary w-10 h-10 cursor-pointer z-100" />
                    </DialogClose>
                  )}
                </div>

                <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto">
                  {children}
                </div>
              </motion.div>
            </DialogContent>
          )}
        </AnimatePresence>
      </DialogPortal>
    </Dialog>
  );
};

export default QuizDrawer;
