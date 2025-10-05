import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import clsx from "clsx";
import UploadDropzone from "./UploadDropzone";
import PasteTextArea from "./PasteTextArea";
import { useEffect } from "react";
import { useNoteStore } from "../../store/noteStore";
import { AnimatePresence, motion } from "framer-motion";

export default function AddSourceModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const tabs = [
    { label: "Upload File", value: "upload" },
    { label: "Web Page", value: "web" },
    { label: "Pasted Text", value: "text" },
  ];

  const currentNote = useNoteStore((state) => state.currentNote);

  useEffect(() => {
    if (currentNote && currentNote?.sources?.length === 0) {
      setIsOpen(true);
    }
  }, [currentNote, setIsOpen]);

  return (
    <AnimatePresence>
    <Dialog
      onClose={() => setIsOpen(false)}
      open={isOpen}
      className="relative z-50"
    >
      <DialogPanel className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogBackdrop
          className="fixed inset-0 bg-black/30 transition-all duration-300 transition-discrete"
          onClick={() => setIsOpen(false)}
        />
        <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white dark:bg-bg-secondary p-4 rounded-md shadow-lg drop-shadow-xl w-[95%] max-w-[500px]">
          <h2 className="text-xl lg:text-2xl font-semibold mb-4">Add a Source</h2>
          <TabGroup>
            <TabList className="flex gap-2 mb-4 text-text">
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  className={clsx(
                    "px-3 py-1 text-sm md:text-base rounded-md bg-neutral-200 cursor-pointer focus:outline-none focus:ring-none",
                    "text-dark data-selected:bg-primary-500 data-selected:text-white"
                  )}
                >
                  {tab.label}
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              
              <TabPanel><UploadDropzone setIsOpen={setIsOpen}/></TabPanel>
              <TabPanel>Web Page</TabPanel>
              <TabPanel><PasteTextArea /></TabPanel>

            </TabPanels>
          </TabGroup>
        </motion.div>
      </DialogPanel>
    </Dialog>
    </AnimatePresence>
  );
}
