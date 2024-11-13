const express = require('express')
const router = express.Router()
const articleController = require('../controllers/articleController')

router.get('/getArticles', articleController.getArticles)
router.get('/getArticleDetailById', articleController.getArticleDetailById)
router.post('/createArticle', articleController.createArticle)
router.post('/createArticleBatch', articleController.createArticleBatch)
router.post('/deleteArticle', articleController.deleteArticle)
// 点赞、收藏
router.post('/collectOrLikeArticle', articleController.collectOrLikeArticle)
router.post(
	'/getCollectAndLikeStatus',
	articleController.getCollectAndLikeStatus
)
module.exports = router
