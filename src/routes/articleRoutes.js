const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

router.get('/getArticles', articleController.getArticles);
router.post('/createArticle', articleController.createArticle);
router.post('/createArticleBatch', articleController.createArticleBatch);

module.exports = router;