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
import { AnimatePresence, motion } from "framer-motion";
import { CloseButtonWithWarning } from "../ui/CloseButtonWithWarning";
import { useQuizStore } from "../../store/quizStore";
import QuizContainer from "./QuizContainer";

interface QuizDrawerProps {
  children?: React.ReactNode;
}

const QuizDrawer = ({ children }: QuizDrawerProps) => {
  const [open, setIsOpen] = useState(false);
  const status = useQuizStore((s) => s.status);

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col gap-3 px-3 py-4 border-2 border-secondary-500/30 dark:border-secondary-500/10 rounded-md cursor-pointer hover:bg-secondary-400/10">
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
                className="overflow-y-auto fixed bottom-0 right-0 h-full w-full bg-bg shadow-lg p-6 flex flex-col z-50"
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
                      <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </DialogClose>
                  )}
                </div>
                <div className="flex-1 flex items-center justify-center">
                  {React.Children.map(children, (child) => {
                    if (
                      React.isValidElement<{ onClose?: () => void }>(child) &&
                      child.type === QuizContainer
                    ) {
                      return React.cloneElement(child, {
                        ...child.props,
                        onClose: () => setIsOpen(false),
                      });
                    }
                    return child;
                  })}
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
