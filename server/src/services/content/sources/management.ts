import SpaceModel from "../../../models/Space.js";
import SourceModel from "../../../models/Source.js";
import { withMongoTransaction } from "../../../utils/db.js";
import { AppError } from "../../../utils/AppError.js";

export const getSourcesBySpaceId = async (spaceId: string) => {
  return await SourceModel.find({ spaceId });
};

export const deleteSourceTransaction = async (id: string, userId: string) => {
  await withMongoTransaction(async (session) => {
    
    const source = await SourceModel.findById(id).session(session);
    if (!source) {
      throw new AppError("Source not found", 404);
    }

    const space = await SpaceModel.findOne({
      userId,
      _id: source.spaceId
    }).session(session);

    if (!space) {
      throw new AppError("Source not found in your spaces", 404);
    }

    const sourceCount = await SourceModel.countDocuments({ spaceId: space._id }).session(session);

    // Prevent deleting the only source
    if (sourceCount <= 1) {
      throw new AppError("Cannot delete the only source in a space", 403);
    }

    await SourceModel.findByIdAndDelete(id).session(session);
  });
};
