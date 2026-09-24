import 'dotenv/config';
import { config } from './config/env.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { logger } from './utils/logger.js';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import sourceRoutes from './routes/sourceRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import flashcardRoutes from './routes/flashcardRoutes.js';
const app = express();
const corsOptions = {
    origin: config.NODE_ENV === 'production'
        ? config.FRONTEND_URL
        : 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
// Morgan HTTP request logger
const morganFormat = config.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Thinkly API' });
});
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/sources', sourceRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/flashcards', flashcardRoutes);
import { errorHandler } from './middleware/errorHandler.js';
app.use(errorHandler);
export default app;
