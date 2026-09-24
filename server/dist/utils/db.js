import mongoose, { Types } from 'mongoose';
/**
 * Executes a function within a MongoDB transaction.
 * Automatically handles starting the session, beginning the transaction,
 * committing, and aborting on error.
 *
 * @param fn The function to execute inside the transaction. It receives the session.
 * @returns The result of the executed function.
 */
export const withMongoTransaction = async (fn) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const result = await fn(session);
        await session.commitTransaction();
        return result;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
/**
 * Checks if a string is a valid MongoDB ObjectId.
 *
 * @param id The string to check.
 * @returns boolean indicating if the id is valid.
 */
export const isValidObjectId = (id) => {
    if (!id)
        return false;
    return Types.ObjectId.isValid(id);
};
