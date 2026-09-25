import SpaceModel from "../../../models/Space.js";
import SourceModel from "../../../models/Source.js";
import { withMongoTransaction } from "../../../utils/db.js";
import { AppError } from "../../../utils/AppError.js";

import mongoose from "mongoose";

export const getSpacesByUserId = async (userId: string) => {
    return await SpaceModel.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
            $lookup: {
                from: "sources",
                localField: "_id",
                foreignField: "spaceId",
                as: "sources"
            }
        },
        {
            $addFields: {
                sourcesCount: { $size: "$sources" }
            }
        },
        {
            $project: {
                sources: 0
            }
        },
        { $sort: { updatedAt: -1 } }
    ]);
};

export const getSpaceByIdAndUserId = async (id: string, userId: string) => {
    const space = await SpaceModel.findOne({ _id: id, userId });
    if (!space) {
        throw new AppError("Space not found", 404);
    }
    
    // Fetch sources concurrently using foreign key
    const sources = await SourceModel.find({ spaceId: id });
    
    // Temporarily attach sources for backward compatibility until frontend is fully updated
    const spaceWithSources = {
        ...space.toObject(),
        sources
    };
    
    return spaceWithSources;
};

export const createNewSpace = async (userId: string) => {
    const space = new SpaceModel({
        userId,
        title: `Untitled Space ${Date.now().toString().slice(-5)}`,
    });
    return await space.save();
};

export const deleteSpaceById = async (id: string, userId: string) => {
    await withMongoTransaction(async (session) => {
        const space = await SpaceModel.findOneAndDelete({ _id: id, userId }).session(session);
        if (!space) {
            throw new AppError("Space not found", 404);
        }
        await SourceModel.deleteMany({ spaceId: id }).session(session);
        // Also we would delete Chats, Quizzes, Flashcards...
    });
};

export const updateSpaceTitle = async (id: string, userId: string, title: string) => {
    const space = await SpaceModel.findOneAndUpdate({ _id: id, userId }, { title }, { new: true });
    if (!space) {
        throw new AppError("Space not found", 404);
    }
    return space;
};
