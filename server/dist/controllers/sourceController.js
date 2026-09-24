import { catchAsync } from "../utils/catchAsync.js";
import { processAndAddSource } from "../services/content/sources/ingestion.js";
import { deleteSourceTransaction } from "../services/content/sources/management.js";
export const addSource = catchAsync(async (req, res, next) => {
    const newSource = await processAndAddSource(req.body, req.userId);
    res.status(201).json({ source: newSource });
});
export const deleteSource = catchAsync(async (req, res, next) => {
    await deleteSourceTransaction(req.params.id, req.userId);
    res.status(200).json({ message: "Source deleted successfully" });
});
