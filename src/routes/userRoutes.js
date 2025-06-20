const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const userControllerMySql = require('../controllers/userControllerMySql')
router.post('/login', userControllerMySql.login)
router.get('/getUsers', userControllerMySql.getUsers)
router.post('/createUser', userControllerMySql.createUser)
router.post('/createUserBatch', userController.createUserBatch)
// 关注用户
router.post('/followUser', userController.followUser)
// 获取用户点赞收藏关注列表
router.get('/getUserActionList', userController.getUserActionList)
// 修改用户信息
router.post('/updateUser', userController.updateUser)
// 上传图片
// router.post('/uploadImage', userController.uploadImage)
module.exports = router
