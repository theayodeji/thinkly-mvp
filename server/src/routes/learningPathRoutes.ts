import express from 'express';
import { generateLearningPath, getLearningPaths } from '../controllers/learningPathController.js';
import { authenticateJWT } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { checkDailyAIActionsLimit } from '../middleware/usageLimit.js';
import { FeatureFlag } from '@thinkly/shared';

const router = express.Router({ mergeParams: true });

router.post('/', authenticateJWT, aiLimiter, checkDailyAIActionsLimit(FeatureFlag.GENERATE_LEARNING_PATH), generateLearningPath);
router.get('/', authenticateJWT, getLearningPaths);

export default router;
