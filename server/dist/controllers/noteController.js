import { catchAsync } from "../utils/catchAsync.js";
import { getNotesByUserId, getNoteByIdAndUserId, createNewNote, deleteNoteById, updateNoteTitle } from "../services/content/notes/management.js";
import { generateChatResponse } from "../services/content/notes/intelligence.js";
export const getNotes = catchAsync(async (req, res, next) => {
    const notes = await getNotesByUserId(req.userId);
    res.status(200).json({ notes });
});
export const getNote = catchAsync(async (req, res, next) => {
    const note = await getNoteByIdAndUserId(req.params.id, req.userId);
    res.status(200).json({ note });
});
export const createNote = catchAsync(async (req, res, next) => {
    const note = await createNewNote(req.userId);
    res.status(200).json({ note });
});
export const deleteNote = catchAsync(async (req, res, next) => {
    await deleteNoteById(req.params.id, req.userId);
    res.status(200).json({ message: "Note deleted" });
});
export const updateNote = catchAsync(async (req, res, next) => {
    await updateNoteTitle(req.params.id, req.userId, req.body.title);
    res.status(200).json({ message: "Note updated" });
});
export const chat = catchAsync(async (req, res, next) => {
    const { history, message, noteId } = req.body;
    const response = await generateChatResponse(noteId, req.userId, message, history);
    res.status(200).json(response);
});
