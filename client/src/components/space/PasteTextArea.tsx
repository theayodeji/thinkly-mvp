import React, { ChangeEvent, useState } from "react";
import { TextInput } from "../ui/TextInput";
import { Button } from "../ui/Button";
import { useClose } from "@headlessui/react";
import { useParams } from "react-router-dom";
import { useAddSource } from "../../hooks/queries/useSpaces";
import { SourceType, MAX_PASTED_TEXT_LENGTH } from "@thinkly/shared";

const PasteTextArea = () => {
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const { id } = useParams<{ id: string }>();
  const { mutateAsync: addSource, isPending: isActionLoading } = useAddSource();
  const close = useClose();

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const isOverLimit = text.length > MAX_PASTED_TEXT_LENGTH;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!id || isOverLimit) return;
    addSource({ id, source: { name, text, type: SourceType.TEXT } }).then(() =>
      close(),
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label>
        <span className="text-sm font-medium text-text-secondary mb-1 block">Name:</span>
        <TextInput
          value={name}
          onChange={handleNameChange}
          placeholder="Source name"
          className="py-2.5"
        />
      </label>
      <label>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-text-secondary">Text:</span>
          <span
            className={`text-xs transition-colors ${
              isOverLimit
                ? "text-red-500 font-bold"
                : text.length > 7000
                ? "text-amber-500 font-semibold"
                : "text-text-secondary"
            }`}
          >
            {text.length.toLocaleString()} / {MAX_PASTED_TEXT_LENGTH.toLocaleString()} characters
          </span>
        </div>
        <textarea
          className={`block w-full p-4 rounded-md border-2 bg-bg focus:shadow-md outline-none resize-none transition-colors ${
            isOverLimit
              ? "border-red-500 focus:shadow-red-500/20"
              : "border-border/80 focus:shadow-primary"
          }`}
          value={text}
          onChange={handleTextChange}
          rows={6}
          placeholder="Paste text here (up to 8,000 characters)..."
        />
      </label>
      {isOverLimit && (
        <p className="text-xs text-red-500 font-medium">
          Pasted text exceeds the 8,000 character limit by {(text.length - MAX_PASTED_TEXT_LENGTH).toLocaleString()} characters.
        </p>
      )}
      <Button
        type="submit"
        variant="primary"
        disabled={name.trim() === "" || text.trim() === "" || isOverLimit || isActionLoading}
        loading={isActionLoading}
      >
        Add Source
      </Button>
    </form>
  );
};

export default PasteTextArea;
