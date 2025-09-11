import React, { ChangeEvent, useState } from "react";
import { TextInput } from "../ui/TextInput";
import { Button } from "../ui/Button";
import { useNoteStore } from "../../store/noteStore";
import { useClose } from "@headlessui/react";

const PasteTextArea = () => {
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const { addSource, currentNote, isActionLoading } = useNoteStore();
  const close = useClose();

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentNote?._id) return;
    addSource(currentNote._id, { name, text, type: 'text' }).then(() => close());
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
          className="block w-full p-4 rounded-md border border-neutral-300 focus:shadow-md focus:shadow-primary outline-none"
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
