import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import eventRoutes from './routes/eventRoutes';
import dotenv from 'dotenv';
import { authMiddleware } from './middlewares/authMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());
app.use('/api/user', userRoutes);
app.use('/api/event', authMiddleware, eventRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});