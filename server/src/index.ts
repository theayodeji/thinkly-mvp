import app from './app.js';
import { config } from './config/env.js';
import connectDB from './config/db.js';
import initKeepAlive from './utils/keepAlive.js';
import { logger } from './utils/logger.js';

const PORT = config.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    // Initialize keep-alive service in production
    if (config.NODE_ENV === 'production') {
      initKeepAlive();
    }
  });
}).catch((err) => {
  logger.error("❌ Server failed to start:", err);
  process.exit(1);
});

export default app;
