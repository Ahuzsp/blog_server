const express = require('express')
const router = express.Router()
const clanController = require('../controllers/clanControllerMySql')

// router.get('/getClanMembers', clanController.getClanMembers)
router.get('/getClanMembers', clanController.getClanMembers)
router.post('/updateClanMember', clanController.updateClanMember)
router.post('/createClanMember', clanController.createClanMember)
router.post('/batchCreateMembers', clanController.batchCreateMembers)

module.exports = router
