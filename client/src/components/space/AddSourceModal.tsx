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
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSpaceSources } from "../../hooks/queries/useSpaces";
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

  const { id } = useParams<{ id: string }>();
  const { data: sources, isLoading } = useSpaceSources(id || "");
  const hasAutoOpened = useRef(false);

  useEffect(() => {
    if (
      !isLoading &&
      sources &&
      sources.length === 0 &&
      !hasAutoOpened.current
    ) {
      setIsOpen(true);
      hasAutoOpened.current = true;
    }
  }, [sources, isLoading, setIsOpen]);

  return (
    <AnimatePresence>
      <Dialog
        onClose={() => setIsOpen(false)}
        open={isOpen}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-all duration-300 transition-discrete" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel as={React.Fragment}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="glass-panel p-6 rounded-2xl w-[95%] max-w-[500px]"
            >
              <h2 className="text-xl lg:text-2xl font-semibold mb-6 text-text">
                Add a Source
              </h2>
              <TabGroup>
                <TabList className="flex gap-2 mb-6">
                  {tabs.map((tab) => (
                    <Tab
                      key={tab.value}
                      className={clsx(
                        "px-4 py-2 text-sm font-medium rounded-lg cursor-pointer focus:outline-none transition-all duration-200",
                        "text-text-secondary bg-white/50 hover:bg-white/80 dark:bg-slate-800/50 dark:hover:bg-slate-700 data-selected:bg-primary-500 data-selected:text-white data-selected:shadow-md",
                      )}
                    >
                      {tab.label}
                    </Tab>
                  ))}
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <UploadDropzone setIsOpen={setIsOpen} />
                  </TabPanel>
                  <TabPanel className="text-text-secondary text-sm p-4 text-center">
                    Web Page (Coming soon)
                  </TabPanel>
                  <TabPanel>
                    <PasteTextArea />
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </motion.div>
          </DialogPanel>
        </div>
      </Dialog>
    </AnimatePresence>
  );
}
