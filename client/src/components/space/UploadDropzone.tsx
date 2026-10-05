import React, { useCallback, useState } from "react";
import clsx from "clsx";
import { NotebookText, Sparkles, UploadCloud, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/Button";
import { useParams } from "react-router-dom";
import { useUploadSource } from "../../hooks/queries/useSpaces";
import toast from "react-hot-toast";
import { SourceType } from "../../shared/types/source";

const UploadDropzone = ({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const { id } = useParams<{ id: string }>();
  const { mutateAsync: uploadSource } = useUploadSource();
  const [isUploading, setIsUploading] = useState(false);

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
    maxSize: 5 * 1024 * 1024, // 5MB limit on the client side
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === "file-too-large") {
        toast.error("File is larger than 5MB");
      } else {
        toast.error("Invalid file");
      }
    }
  });

  const handleUpload = async () => {
    if (acceptedFiles.length > 0) {
      try {
        setIsUploading(true);
        if (!id) return;

        const formData = new FormData();
        formData.append("spaceId", id);
        formData.append("type", SourceType.FILE_PDF);
        formData.append("name", acceptedFiles[0].name);
        formData.append("file", acceptedFiles[0]);

        await uploadSource({ spaceId: id, formData });
        setIsOpen(false);
      } catch (error) {
        console.error("Error uploading source:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div
        {...getRootProps()}
        className={clsx(
          "border-2 border-dashed border-primary-300 dark:border-slate-600 bg-white/40 dark:bg-slate-800/40 rounded-xl text-center px-6 py-10 w-full flex flex-col items-center justify-center transition-all duration-300 cursor-pointer hover:bg-primary-50 dark:hover:bg-slate-700/50 hover:border-primary-400",
          isDragActive || isUploading ? "bg-primary-100 dark:bg-slate-700 border-primary-500" : "",
        )}
      >
        <UploadCloud size={48} strokeWidth={1.5} className="text-primary-500 mb-4" />
        <p className="text-base font-medium text-text mb-1">
          Drag and drop a file here, or click to select
        </p>
        <p className="text-sm text-text-secondary">
          Supported formats: PDF, DOC, DOCX (Max 5MB)
        </p>
        <input {...getInputProps()} disabled={isUploading} />

        {/* display the document name and icon based on type */}
        {acceptedFiles?.length > 0 &&
        (acceptedFiles[0].type.startsWith("application/pdf") ||
          acceptedFiles[0].type.startsWith("application/msword") ||
          acceptedFiles[0].type.startsWith(
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
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
      
      <Button
        disabled={acceptedFiles?.length === 0 || isUploading}
        icon={<Sparkles className="w-5 h-5" />}
        className="mt-3 self-end"
        onClick={handleUpload}
        loading={isUploading}
      >
        {isUploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
};

export default UploadDropzone;
