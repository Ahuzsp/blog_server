const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/getUsers', userController.getUsers);
router.post('/createUser', userController.createUser);
router.post('/createUserBatch', userController.createUserBatch);

module.exports = router;