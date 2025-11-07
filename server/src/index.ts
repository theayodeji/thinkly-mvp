import 'dotenv/config'; 
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import connectDB from './config/db.js';
import noteRoutes from './routes/noteRoutes.js';
import sourceRoutes from './routes/sourceRoutes.js';
import cookieParser from 'cookie-parser';
import quizRoutes from './routes/quizRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
// Configure CORS based on environment
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Thinkly API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/sources', sourceRoutes);
app.use('/api/quiz', quizRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("❌ Server failed to start:", err);
  process.exit(1);
});

export default app;
