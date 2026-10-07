import type { Request, Response } from "express";
import { eventStreamManager } from "../utils/eventStreamManager.js";

export const subscribeToEvents = (req: Request, res: Response) => {
  const userId = req.userId as string;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  // Send initial connection confirmation
  res.write(`event: connected\ndata: ${JSON.stringify({ userId, connectedAt: new Date().toISOString() })}\n\n`);

  eventStreamManager.addClient(userId, res);
};
