import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import * as identifyController from './src/controllers/identifyController.js';

const app = express();

app.use(express.json());

// Request logger for debugging
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    if (req.method === 'POST') {
        console.log(`[${timestamp}] Body:`, JSON.stringify(req.body));
    }
    next();
});

// Main assignment route (POST only)
app.post('/identify', identifyController.identify);

// Catch-all for /identify with wrong method
app.all('/identify', (req, res) => {
    console.log(`[${new Date().toISOString()}] Rejected ${req.method} on /identify`);
    res.status(405).json({
        error: 'Method Not Allowed',
        message: 'The /identify endpoint only accepts POST requests.',
        requestedMethod: req.method,
        suggestion: 'Ensure you are using the POST method in your request.'
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
