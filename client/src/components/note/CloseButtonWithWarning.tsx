import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ReactNode, useState } from "react";

type CloseButtonWithWarningProps = {
  onConfirm: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

export function CloseButtonWithWarning({
  onConfirm,
  children,
  title = "Are you sure?",
  description = "You have unsaved changes that will be lost if you continue.",
  confirmText = "Yes, close",
  cancelText = "Cancel",
}: CloseButtonWithWarningProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button type="button" className="relative z-10">
          {children}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0 z-50" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none">
          <Dialog.Title className="m-0 text-lg font-medium text-gray-900">
            {title}
          </Dialog.Title>
          
          <Dialog.Description className="mt-4 mb-5 text-sm leading-normal text-gray-600">
            {description}
          </Dialog.Description>

          <div className="mt-6 flex justify-end space-x-3">
            <Dialog.Close asChild>
              <button className="inline-flex h-9 items-center justify-center rounded-md bg-gray-100 px-4 text-sm font-medium text-gray-900 hover:bg-gray-200">
                {cancelText}
              </button>
            </Dialog.Close>
            <button
              onClick={handleConfirm}
              className="inline-flex h-9 items-center justify-center rounded-md bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700"
            >
              {confirmText}
            </button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 inline-flex h-6 w-6 appearance-none items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
              aria-label="Close"
            >
              <X />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CloseButtonWithWarning;