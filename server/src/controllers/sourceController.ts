import type { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { processAndAddSource } from "../services/content/sources/ingestion.js";
import { deleteSourceTransaction } from "../services/content/sources/management.js";

export const addSource = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const newSource = await processAndAddSource(req.body, req.userId as string);
  res.status(201).json({ source: newSource });
});

export const deleteSource = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await deleteSourceTransaction(req.params.id as string, req.userId as string);
  res.status(200).json({ message: "Source deleted successfully" });
});
