import React, { useState } from "react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  AlertTriangle,
  EditIcon,
  EllipsisVertical,
  Share2Icon,
  Trash2Icon,
  X,
} from "lucide-react";
import { useDeleteSpace } from "../../hooks/queries/useSpaces";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const SpaceMenu = ({ SpaceId }: { SpaceId: string }) => {
  const { mutateAsync: deleteSpace, isPending } = useDeleteSpace();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    if (SpaceId) {
      try {
        await deleteSpace(SpaceId);
        toast.success("Space deleted successfully");
        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.error("Failed to delete Space:", error);
      }
    }
  };

  return (
    <>
      <Popover className="relative">
        <PopoverButton className="outline-none focus:outline-none p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-text-secondary">
          <EllipsisVertical />
        </PopoverButton>
        <PopoverPanel
          anchor="bottom"
          className="items-start flex flex-col bg-bg-secondary shadow-2xl drop-shadow-xl rounded-md z-40 overflow-hidden"
        >
          {({ close }) => (
            <>
              <button
                className="w-full flex items-center justify-start py-4 px-8 pl-4 hover:bg-neutral/60 transition-colors duration-300 cursor-pointer"
              >
                <EditIcon className="inline w-4 h-4 mr-2" /> Rename
              </button>
              <button
                className="w-full flex items-center justify-start py-4 px-8 pl-4 hover:bg-neutral/60 transition-colors duration-300 cursor-pointer"
              >
                <Share2Icon className="inline w-4 h-4 mr-2" /> Share
              </button>
              
              <button 
                onClick={() => {
                  setIsDeleteDialogOpen(true);
                  close();
                }}
                className="outline-none w-full flex items-center justify-start py-4 px-8 pl-4 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 transition-colors duration-300 cursor-pointer"
              >
                <Trash2Icon className="inline w-4 h-4 mr-2 text-red-500" />
                <span>Delete</span>
              </button>
            </>
          )}
        </PopoverPanel>
      </Popover>

      <AnimatePresence>
        {isDeleteDialogOpen && (
          <Dialog
            static
            open={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            className="relative z-50"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />

            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
              <DialogPanel
                as={motion.div}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500" />
                  </div>
                  <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                    Delete Space?
                  </DialogTitle>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  This action cannot be undone. All your notes, chats, and resources in this space will be permanently deleted.
                </p>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsDeleteDialogOpen(false)}
                    className="px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-sm"
                  >
                    {isPending ? "Deleting..." : "Delete Space"}
                  </button>
                </div>
              </DialogPanel>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default SpaceMenu;
