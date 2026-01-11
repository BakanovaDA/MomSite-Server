const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

// Основной роут для получения файла
router.get('/:bucket/:filename', fileController.getFile);

// Роут для списка файлов
router.get('/:bucket', fileController.listFiles);

module.exports = router;