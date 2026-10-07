import express from 'express';
import { generateLearningPath, getLearningPaths } from '../controllers/learningPathController.js';
import { authenticateJWT } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { checkFeatureAccess, checkMeteredLimit } from '../middleware/usageLimit.js';
import { FeatureFlag } from '@thinkly/shared';

import { allowGuestOrAuth, checkGuestLimit } from '../middleware/guest.js';

const router = express.Router({ mergeParams: true });

router.post('/', allowGuestOrAuth, aiLimiter, checkGuestLimit("generate_learning_path"), checkFeatureAccess(FeatureFlag.GENERATE_LEARNING_PATH), checkMeteredLimit(FeatureFlag.GENERATE_LEARNING_PATH), generateLearningPath);
router.get('/', allowGuestOrAuth, getLearningPaths);

export default router;
