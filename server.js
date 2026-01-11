const express = require('express');
const cors = require('cors');
const fileRoutes = require('./routes/fileRoutes');

const app = express();
const PORT = 5000;

// Разрешаем запросы с фронта
app.use(cors({
    origin: '*', // process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

// Подключаем роуты
app.use('/api/files', fileRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});

app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
    console.log(`📁 Files: http://localhost:${PORT}/api/files/:bucket/:filename`);
});