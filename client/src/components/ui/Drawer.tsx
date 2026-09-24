import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { CloseButtonWithWarning } from "./CloseButtonWithWarning";

interface QuizDrawerProps {
  children?: React.ReactNode;
  closeType?: "warning" | "normal";
  trigger: React.ReactNode;
  title?: string;
  position?: "right" | "bottom" | "fullscreen";
}

const QuizDrawer = ({
  children,
  closeType,
  trigger,
  title,
  position = "fullscreen",
}: QuizDrawerProps) => {
  const [open, setIsOpen] = useState(false);

  const getAnimationProps = () => {
    if (position === "right") {
      return {
        initial: { opacity: 0, x: 400 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 400 },
      };
    }
    return {
      initial: { opacity: 0, y: 420 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 420 },
    };
  };

  const getClassName = () => {
    const base = "fixed shadow-2xl bg-bg flex flex-col z-[100] border-border/50";
    if (position === "right") {
      return `${base} top-0 right-0 h-full w-full md:w-[450px] p-6 border-l`;
    }
    return `${base} bottom-0 right-0 h-full w-full p-6`;
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogPortal forceMount>
        <AnimatePresence>
          {open && (
            <>
              {position === "right" && (
                <DialogClose asChild>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
                  />
                </DialogClose>
              )}
              <DialogContent asChild forceMount>
                <motion.div
                  {...getAnimationProps()}
                  transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                  className={getClassName()}
                >
                  <div className="flex justify-between items-center mb-6 shrink-0">
                    <DialogTitle className="text-xl font-semibold">
                      {title || "Thinkly Drawer"}
                    </DialogTitle>
                    {closeType === "warning" ? (
                      <CloseButtonWithWarning onConfirm={() => setIsOpen(false)}>
                        <X className="rounded-full p-2 bg-bg-secondary hover:bg-bg-secondary/80 text-text-secondary w-10 h-10 cursor-pointer" />
                      </CloseButtonWithWarning>
                    ) : (
                      <DialogClose asChild>
                        <button
                          onClick={() => setIsOpen(false)}
                          className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-text-secondary"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </DialogClose>
                    )}
                  </div>
                  <div className={`flex-1 overflow-y-auto custom-scrollbar ${position === "right" ? "" : "flex items-center justify-center"}`}>
                    {children}
                  </div>
                </motion.div>
              </DialogContent>
            </>
          )}
        </AnimatePresence>
      </DialogPortal>
    </Dialog>
  );
};

export default QuizDrawer;
