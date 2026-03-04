import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log('-------------------------------------------');
    console.log(`🚀 Bitespeed Identity Service Started`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🩺 Health: http://localhost:${PORT}/health`);
    console.log('-------------------------------------------');
});
