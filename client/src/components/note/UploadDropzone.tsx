import React, { useCallback, useState } from "react";
import clsx from "clsx";
import { NotebookText, Sparkles, UploadCloud, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/Button";
import { usePdfTextExtractor } from "../../hooks/usePdfExtraction";
import { useNoteStore } from "../../store/noteStore";
import toast from "react-hot-toast";

const UploadDropzone = ({setIsOpen}: {setIsOpen: (isOpen: boolean) => void}) => {
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const { extractFromFile, text, loading, error } = usePdfTextExtractor();
  const { addSource,currentNote, isActionLoading, } = useNoteStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
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

  const handleUpload = async () => {
    if (acceptedFiles.length > 0) {
      try {
        const result = await extractFromFile(acceptedFiles[0]);
        addSource(currentNote?._id!, {
          name: acceptedFiles[0].name,
          text: result,
          type: "pdf",
        });
        toast.success("Source added successfully");
        setIsOpen(false);
      } catch (error) {
        console.error("Error extracting text:", error);
        toast.error((error as Error)?.message || "Failed to extract text from PDF. Please ensure it is a valid PDF file.");
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div
        {...getRootProps()}
        className={clsx(
          "border-2 border-dashed border-neutral rounded-md text-center px-4 py-6 w-full flex flex-col items-center justify-center transition-colors duration-300 cursor-pointer",
          isDragActive || loading ? "bg-neutral/20" : ""
        )}
      >
        <UploadCloud size={64} strokeWidth={1} className="text-neutral mb-4" />
        <p className="text-md">
          Drag and drop a file here, or click to select a file
        </p>
        <p className="text-xs text-neutral">
          Supported formats: PDF, DOC, DOCX
        </p>
        <input {...getInputProps()} disabled={loading} />

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
      {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
      <Button
        disabled={acceptedFiles?.length === 0 || loading}
        icon={<Sparkles className="w-5 h-5" />}
        className="mt-3 self-end"
        onClick={handleUpload}
        loading={loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
};

export default UploadDropzone;
