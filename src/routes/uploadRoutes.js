const express = require('express')
const router = express.Router()
const uploadController = require('../controllers/uploadController.js')

router.post('/uploadImage', uploadController.uploadImage)

module.exports = router
