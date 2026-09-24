import NoteModel from "../../../models/Note.js";
import geminiService from "../../../utils/genai.js";
import { AppError } from "../../../utils/AppError.js";
export const generateChatResponse = async (noteId, userId, message, history = []) => {
    const note = await NoteModel.findOne({ _id: noteId, userId });
    if (!note) {
        throw new AppError("Note not found", 404);
    }
    const fullHistory = [...history, { role: "user", content: message }];
    const resultStr = await geminiService.generateChat("Content: " + note.content + "\n\n" + "History: " + JSON.stringify(fullHistory));
    return JSON.parse(resultStr);
};
