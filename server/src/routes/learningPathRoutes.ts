import express from 'express';
import { generateLearningPath, getLearningPaths } from '../controllers/learningPathController.js';
import { authenticateJWT } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router({ mergeParams: true });

router.post('/', authenticateJWT, aiLimiter, generateLearningPath);
router.get('/', authenticateJWT, getLearningPaths);

export default router;
