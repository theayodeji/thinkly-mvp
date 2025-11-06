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
}

const QuizDrawer = ({
  children,
  closeType,
  trigger,
  title,
}: QuizDrawerProps) => {
  const [open, setIsOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

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
                    {title || "Thinkly Drawer"}
                  </DialogTitle>
                  {closeType === "warning" ? (
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
                <div className="flex-1 overflow-y-auto flex items-center justify-center">
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
