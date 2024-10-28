const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/login', userController.login);
router.get('/getUsers', userController.getUsers);
router.post('/createUser', userController.createUser);
router.post('/createUserBatch', userController.createUserBatch);

module.exports = router;