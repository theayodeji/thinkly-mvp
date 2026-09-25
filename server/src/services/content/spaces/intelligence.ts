import SpaceModel from "../../../models/Space.js";
import SourceModel from "../../../models/Source.js";
import ChatModel from "../../../models/Chat.js";
import ChatMessageModel from "../../../models/ChatMessage.js";
import geminiService from "../../../utils/genai.js";
import { AppError } from "../../../utils/AppError.js";

export const generateChatResponse = async (spaceId: string, userId: string, message: string, _history: any[] = []) => {
    const space = await SpaceModel.findOne({ _id: spaceId, userId });
    if (!space) {
        throw new AppError("Space not found", 404);
    }
    
    // Find or create chat
    let chat = await ChatModel.findOne({ spaceId, userId });
    if (!chat) {
        chat = new ChatModel({ spaceId, userId, title: "Chat" });
        await chat.save();
    }

    const sources = await SourceModel.find({ spaceId });
    const sourcesContext = sources.map(s => s.text).join('\n\n');

    // Add user message to DB
    await ChatMessageModel.create({
        chatId: chat._id,
        spaceId,
        role: "user",
        content: message
    });

    // Fetch recent history for context
    const recentMessages = await ChatMessageModel.find({ chatId: chat._id })
        .sort({ createdAt: 1 })
        .lean();

    const historyText = recentMessages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n');

    const stream = await geminiService.generateChatStream(
      "Space Content: " + space.content + "\n\nSources:\n" + sourcesContext + "\n\n" + "History:\n" + historyText
    );
    
    // We return the stream, and a callback to save the full response once done
    return {
      stream,
      saveResponse: async (fullResponse: string) => {
        await ChatMessageModel.create({
            chatId: chat._id,
            spaceId,
            role: "assistant",
            content: fullResponse
        });
      }
    };
};
