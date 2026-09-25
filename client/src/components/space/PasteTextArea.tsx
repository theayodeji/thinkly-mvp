import React, { ChangeEvent, useState } from "react";
import { TextInput } from "../ui/TextInput";
import { Button } from "../ui/Button";
import { useClose } from "@headlessui/react";
import { useParams } from "react-router-dom";
import { useAddSource } from "../../hooks/queries/useSpaces";
import { SourceType } from "@thinkly/shared";

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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!id) return;
    addSource({ id, source: { name, text, type: SourceType.TEXT } }).then(() =>
      close(),
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label>
        <span>Name:</span>
        <TextInput
          value={name}
          onChange={handleNameChange}
          placeholder="Source name"
          className="py-2.5"
        />
      </label>
      <label>
        <span>Text:</span>
        <textarea
          className="block w-full p-4 rounded-md border-2 border-border/80 bg-bg focus:shadow-md focus:shadow-primary outline-none resize-none"
          value={text}
          onChange={handleTextChange}
          rows={4}
          placeholder="Paste text here..."
        />
      </label>
      <Button
        type="submit"
        variant="primary"
        disabled={name.trim() === "" || text.trim() === "" || isActionLoading}
        loading={isActionLoading}
      >
        Add
      </Button>
    </form>
  );
};

export default PasteTextArea;
