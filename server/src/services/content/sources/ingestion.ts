import { ISource, SourceType } from "@thinkly/shared";
import NoteModel from "../../../models/Note.js";
import SourceModel from "../../../models/Source.js";
import geminiService from "../../../utils/genai.js";
import { withMongoTransaction } from "../../../utils/db.js";
import { AppError } from "../../../utils/AppError.js";

export const processAndAddSource = async (source: ISource, userId: string) => {
  const { title } = await geminiService.generateTitle(source.text || "");
  const { summary } = await geminiService.generateSummary(source.text || "");
  const { questions } = await geminiService.generateChatSuggestions(source.text || "");
  source.name = source.name || title;

  let newSource: any = null;

  await withMongoTransaction(async (session) => {
    // Find the note and lock it for update
    const note = await NoteModel.findOne({ _id: source.noteId, userId }).session(session);
    
    if (!note) {
      throw new AppError("Note not found", 404);
    }

    // Create the source first
    newSource = new SourceModel({
      ...source,
      status: source.type === SourceType.TEXT ? "parsed" : "parsing", // Set initial status
    });
    await newSource.save({ session });

    // Update the note with the new source
    note.sources.push(String(newSource._id));
    note.content = (note.content || "") + "\n" + source.text;
    note.chatSuggestions = [...(note.chatSuggestions || []), ...questions];

    // Generate title if this is the first source
    if (note.sources.length === 1) {
      note.title = title;
      note.summary = summary;
    }
    await note.save({ session }); 
  });

  return newSource;
};
