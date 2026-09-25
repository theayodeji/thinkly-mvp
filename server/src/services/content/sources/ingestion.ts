import { ISource, SourceType } from "@thinkly/shared";
import SpaceModel from "../../../models/Space.js";
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
    // Find the space and lock it for update
    const space = await SpaceModel.findOne({ _id: source.spaceId, userId }).session(session);
    
    if (!space) {
      throw new AppError("Space not found", 404);
    }

    // Create the source
    newSource = new SourceModel({
      ...source,
      status: source.type === SourceType.TEXT ? "parsed" : "parsing", // Set initial status
    });
    await newSource.save({ session });

    // Update the space content and optionally title/summary
    space.content = (space.content || "") + "\n" + source.text;

    // Check if this is the first source
    const sourceCount = await SourceModel.countDocuments({ spaceId: space._id }).session(session);
    
    // Generate title if this is the first source
    if (sourceCount === 1) { // 1 because we just saved it
      space.title = title;
      space.summary = summary;
    }
    await space.save({ session }); 
  });

  return newSource;
};
