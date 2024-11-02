const express = require('express');
const router = express.Router();
const logController = require('../controllers/statisticController');

router.get('/getLogs', logController.getLogs);
router.post('/logger', logController.logger);

module.exports = router;