const express = require('express');
const cors = require('cors');
const fileRoutes = require('./routes/fileRoutes');
const postRoutes = require('./routes/postRoutes');
const app = express();
const PORT = 5000;

// Разрешаем запросы с фронта
app.use(cors({
    origin: '*', // process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

// Подключаем роуты
app.use('/api/files', fileRoutes);
app.use('/api/posts', postRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});

app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
    console.log(`📁 Files: http://localhost:${PORT}/api/files/:bucket/:filename`);
    console.log(`📢 Posts: http://localhost:${PORT}/api/posts/:bucket`);
});