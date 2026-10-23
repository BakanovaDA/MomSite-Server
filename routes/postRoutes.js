const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Роут для списка постов
router.get('/:bucket', postController.getPosts);

module.exports = router;