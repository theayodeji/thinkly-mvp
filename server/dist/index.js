import express from 'express';
// import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import connectDB from './config/db.js';
// dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Configure CORS based on environment
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};
app.use(cors(corsOptions));
app.use(express.json());
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Thinkly API' });
});
app.use('/api/auth', authRoutes);
app.use((err, req, res, next) => {
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
//# sourceMappingURL=index.js.map