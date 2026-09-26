import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { AudioExplainerService } from "../services/content/explainers/management.js";
import AudioExplainer from "../models/AudioExplainer.js";

const explainerService = new AudioExplainerService();

export const generateExplainer = catchAsync(async (req: Request, res: Response) => {
  const { spaceId } = req.params;
  const { concept, voiceId } = req.body;
  const userId = (req.user as any)._id;

  const explainer = await explainerService.generateExplainer(
    userId.toString(),
    spaceId as string,
    concept,
    voiceId
  );

  res.status(202).json({
    status: "success",
    data: explainer,
  });
});

export const getExplainersForSpace = catchAsync(async (req: Request, res: Response) => {
  const { spaceId } = req.params;
  const userId = (req.user as any)._id;

  const explainers = await AudioExplainer.find({ spaceId: spaceId as string, userId }).sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    data: explainers,
  });
});

export const getExplainer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.user as any)._id;

  const explainer = await AudioExplainer.findOne({ _id: id, userId });
  if (!explainer) {
    return res.status(404).json({ status: "error", message: "Explainer not found" });
  }

  res.status(200).json({
    status: "success",
    data: explainer,
  });
});

export const deleteExplainer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.user as any)._id;

  const explainer = await AudioExplainer.findOneAndDelete({ _id: id, userId });
  
  if (!explainer) {
    return res.status(404).json({ status: "error", message: "Explainer not found" });
  }

  // Optionally delete from S3 here if needed.

  res.status(204).json({
    status: "success",
    data: null,
  });
});
