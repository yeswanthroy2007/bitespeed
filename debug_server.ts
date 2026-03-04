import express from 'express';

const app = express();
app.use(express.json());

app.post('/identify', (req, res) => {
    console.log('📥 Received request:', req.body);
    res.status(200).json({ status: 'working', received: req.body });
});

app.get('/', (req, res) => res.send('Debug server is running!'));

const PORT = 3000;
app.listen(PORT, () => {
    console.log('-------------------------------------------');
    console.log(`🚀 DEBUG SERVER RUNNING ON PORT ${PORT}`);
    console.log(`🔗 Test with: curl -X POST http://localhost:${PORT}/identify -H "Content-Type: application/json" -d '{"email":"test@g.com"}'`);
    console.log('-------------------------------------------');
});
