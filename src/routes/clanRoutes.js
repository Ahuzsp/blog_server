const express = require('express')
const router = express.Router()
const clanRoutes = require('../controllers/clanController')

router.get('/getClanMembers', clanRoutes.getClanMembers)
router.post('/updateClanMember', clanRoutes.updateClanMember)
router.post('/createClanMember', clanRoutes.createClanMember)
router.post('/batchCreateMembers', clanRoutes.batchCreateMembers)

module.exports = router
