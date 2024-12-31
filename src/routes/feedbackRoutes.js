const express = require('express')
const router = express.Router()
const feedbackControl = require('../controllers/createFeedback.js')

router.post('/createFeedback', feedbackControl.createFeedback)

module.exports = router
