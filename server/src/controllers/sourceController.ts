import type { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { processAndAddSource } from "../services/content/sources/ingestion.js";
import { deleteSourceTransaction, getSourcesBySpaceId } from "../services/content/sources/management.js";

export const getSources = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const sources = await getSourcesBySpaceId(req.params.spaceId as string);
  res.status(200).json({ sources });
});

import { S3StorageProvider } from "../services/storage/S3StorageProvider.js";
import { parsePdfBuffer } from "../services/content/sources/documentParser.js";

const storageProvider = new S3StorageProvider();

export const addSource = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const sourceData = { ...req.body };
  if (req.file) {
    const filename = `${Date.now()}-${req.file.originalname}`;
    sourceData.file_url = await storageProvider.uploadFile(
      req.file.buffer,
      filename,
      req.file.mimetype
    );
    
    if (req.file.mimetype === 'application/pdf') {
      sourceData.text = await parsePdfBuffer(req.file.buffer);
    }
  }
  const newSource = await processAndAddSource(sourceData, req.userId as string);
  res.status(201).json({ source: newSource });
});

export const deleteSource = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await deleteSourceTransaction(req.params.id as string, req.userId as string);
  res.status(200).json({ message: "Source deleted successfully" });
});
