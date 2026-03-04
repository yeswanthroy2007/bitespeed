import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import identifyRoutes from './src/routes/identifyRoutes.js';

const app = express();

app.use(express.json());

// Request logger for debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/', identifyRoutes);

// Explicit GET handler for /identify to guide users
app.get('/identify', (req, res) => {
    res.status(405).json({
        error: 'Method Not Allowed',
        message: 'The /identify endpoint only accepts POST requests. Please ensure you are using the POST method in Postman.'
    });
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Debug route
app.get('/test', (req, res) => {
    res.status(200).json({ message: 'server working' });
});

export default app;
