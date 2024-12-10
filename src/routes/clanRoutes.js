const express = require('express')
const router = express.Router()
const clanRoutes = require('../controllers/ClanController')

router.get('/getClanMembers', clanRoutes.getClanMembers)
router.post('/createClanMember', clanRoutes.createClanMember)
router.post('/batchCreateMembers', clanRoutes.batchCreateMembers)

module.exports = router
