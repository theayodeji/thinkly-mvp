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

  const {currentNote} = useNoteStore();

  useEffect(() => {
    if (currentNote && currentNote.sources?.length === 0) {
      setIsOpen(true);
    }
  }, [currentNote]);

  return (
    <Dialog
      onClose={() => setIsOpen(false)}
      open={isOpen}
      className="relative z-50"
    >
      <DialogPanel className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogBackdrop
          className="fixed inset-0 bg-black/30"
          onClick={() => setIsOpen(false)}
        />
        <div className=" bg-white p-4 rounded-md shadow-lg drop-shadow-xl w-[95%] max-w-[500px]">
          <h2 className="text-xl lg:text-2xl font-semibold mb-4">Add a Source</h2>
          <TabGroup>
            <TabList className="flex gap-2 mb-4">
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  className={clsx(
                    "px-3 py-1 text-sm md:text-base rounded-md bg-neutral-100 cursor-pointer",
                    "data-selected:bg-primary-500 data-selected:text-white"
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
        </div>
      </DialogPanel>
    </Dialog>
  );
}
