import { Request, Response } from 'express';
import LearningPath from '../models/LearningPath.js';
import Space from '../models/Space.js';
import geminiService from '../utils/genai.js';

export const generateLearningPath = async (req: Request, res: Response): Promise<any> => {
  try {
    const { spaceId } = req.params;
    const { topic } = req.body;
    const userId = (req as any).userId;

    if (!topic) {
      return res.status(400).json({ message: 'Topic is required' });
    }

    const space = await Space.findOne({ _id: spaceId, userId });
    if (!space) {
      return res.status(404).json({ message: 'Space not found' });
    }

    const SourceModel = (await import('../models/Source.js')).default;
    const sources = await SourceModel.find({ spaceId });
    const sourcesContext = sources.map(s => s.text).join('\n\n');

    const contentContext = [space.content || '', sourcesContext].filter(Boolean).join('\n\n');
    if (!contentContext.trim()) {
      return res.status(400).json({ message: 'Cannot generate learning path: No content or sources found in this space' });
    }

    const aiResult = await geminiService.generateLearningPath(topic, contentContext);

    if (aiResult.error) {
      return res.status(400).json({ message: aiResult.error });
    }

    const newLearningPath = new LearningPath({
      spaceId,
      userId,
      topic: aiResult.topic || topic,
      nodes: aiResult.nodes || [],
    });

    await newLearningPath.save();

    return res.status(201).json(newLearningPath);
  } catch (error) {
    console.error('Error generating learning path:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getLearningPaths = async (req: Request, res: Response): Promise<any> => {
  try {
    const { spaceId } = req.params;
    const userId = (req as any).userId;

    const paths = await LearningPath.find({ spaceId, userId }).sort({ createdAt: -1 });
    return res.status(200).json(paths);
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
