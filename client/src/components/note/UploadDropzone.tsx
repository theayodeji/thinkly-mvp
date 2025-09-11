import React, { useCallback, useState } from "react";
import clsx from "clsx";
import { NotebookText, UploadCloud, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/Button";

const UploadDropzone = () => {
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    setAcceptedFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
  });

  return (
    <div className="flex flex-col">
      <div
        {...getRootProps()}
        className={clsx(
          "border-2 border-dashed border-neutral rounded-md text-center px-4 py-6 w-full flex flex-col items-center justify-center transition-colors duration-300 cursor-pointer",
          isDragActive ? "bg-neutral/20" : ""
        )}
      >
        <UploadCloud size={64} strokeWidth={1} className="text-neutral mb-4" />
        <p className="text-md">
          Drag and drop a file here, or click to select a file
        </p>
        <p className="text-xs text-neutral">
          Supported formats: PDF, DOC, DOCX
        </p>
        <input {...getInputProps()} />

        {/* display the document name and icon based on type */}
        {acceptedFiles?.length > 0 &&
        (acceptedFiles[0].type.startsWith("application/pdf") ||
          acceptedFiles[0].type.startsWith("application/msword") ||
          acceptedFiles[0].type.startsWith(
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          )) ? (
          <div className="flex items-center gap-2 mt-4 max-w-[300px] rounded-lg bg-secondary-500/50 px-2 py-1">
            <NotebookText strokeWidth={1} className="w-4 h-4" />
            <p className="font-medium truncate">{acceptedFiles[0].name}</p>
            <X
              className="w-5 h-5 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setAcceptedFiles([]);
              }}
            />
          </div>
        ) : acceptedFiles?.length > 0 ? (
          <p className="text-xs text-red-500 mt-4">Invalid file type</p>
        ) : null}
      </div>
      <Button disabled={acceptedFiles?.length === 0} className="mt-3 self-end">
        Upload
      </Button>
    </div>
  );
};

export default UploadDropzone;
