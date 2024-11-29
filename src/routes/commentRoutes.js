const express = require('express')
const router = express.Router()
const commentController = require('../controllers/commentController.js')

router.post('/getCommentsByArticleId', commentController.getCommentsByArticleId)
router.post('/createComment', commentController.createComment)
router.post('/deleteComment', commentController.deleteComment)

module.exports = router
