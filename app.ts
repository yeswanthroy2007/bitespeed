import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import identifyRoutes from './src/routes/identifyRoutes.js';

const app = express();

app.use(express.json());

// Routes
app.use('/', identifyRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

export default app;
