const express = require('express')
const router = express.Router()
const handleRefreshToken = require('../controller/RefreshToken')

router.get('/', handleRefreshToken)

module.exports = router