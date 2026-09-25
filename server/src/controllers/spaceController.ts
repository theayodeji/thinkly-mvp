import type { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { 
    getSpacesByUserId, 
    getSpaceByIdAndUserId, 
    createNewSpace, 
    deleteSpaceById, 
    updateSpaceTitle 
} from "../services/content/spaces/management.js";
import { generateChatResponse } from "../services/content/spaces/intelligence.js";
import ChatModel from "../models/Chat.js";
import ChatMessageModel from "../models/ChatMessage.js";

export const getSpaces = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const spaces = await getSpacesByUserId(req.userId as string);
    res.status(200).json({ spaces });
});

export const getSpace = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const space = await getSpaceByIdAndUserId(req.params.id as string, req.userId as string);
    res.status(200).json({ space });
});

export const createSpace = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const space = await createNewSpace(req.userId as string);
    res.status(200).json({ space });
});

export const deleteSpace = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await deleteSpaceById(req.params.id as string, req.userId as string);
    res.status(200).json({ message: "Space deleted" });
});

export const updateSpace = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await updateSpaceTitle(req.params.id as string, req.userId as string, req.body.title);
    res.status(200).json({ message: "Space updated" });
});

export const chat = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const { history, message, spaceId } = req.body;
    const { stream, saveResponse } = await generateChatResponse(spaceId, req.userId as string, message, history);
    
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";
    let isClientConnected = true;

    req.on('close', async () => {
        isClientConnected = false;
        // User disconnected (clicked stop or closed tab). Save the partial response!
        try {
            if (fullResponse) {
                await saveResponse(fullResponse);
            }
        } catch (e) {
            console.error("Error saving partial response on close:", e);
        }
    });

    try {
        for await (const chunk of stream) {
            if (!isClientConnected) break;
            
            fullResponse += chunk;
            res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
        }
        
        if (isClientConnected) {
            await saveResponse(fullResponse);
            res.write(`data: [DONE]\n\n`);
            res.end();
        }
    } catch (error) {
        console.error("Error streaming chat response:", error);
        if (isClientConnected) {
            res.write(`data: [ERROR]\n\n`);
            res.end();
        }
    }
});

export const getChatHistory = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const chat = await ChatModel.findOne({ spaceId: req.params.id, userId: req.userId as string });
    if (!chat) {
        return res.status(200).json({ history: [], hasMore: false });
    }

    const cursor = req.query.cursor as string | undefined;
    const limit = parseInt(req.query.limit as string) || 20;

    const query: any = { chatId: chat._id };
    
    // If a cursor is provided, fetch messages older than the cursor (createdAt < cursor)
    if (cursor) {
        query.createdAt = { $lt: new Date(cursor) };
    }

    // We want the most recent messages, so we sort descending by createdAt.
    const messages = await ChatMessageModel.find(query)
        .sort({ createdAt: -1 })
        .limit(limit + 1) // Fetch one extra to determine if there's a next page
        .lean();

    const hasMore = messages.length > limit;
    
    // Remove the extra item if we fetched it
    if (hasMore) {
        messages.pop();
    }

    // Since we sorted descending to get the most recent N items before the cursor,
    // the array is backwards (newest first). We need to reverse it so the frontend
    // gets them in chronological order (oldest first) within the page.
    messages.reverse();

    const nextCursor = messages.length > 0 ? messages[0].createdAt : undefined;

    res.status(200).json({ 
        history: messages, 
        hasMore,
        nextCursor 
    });
});
