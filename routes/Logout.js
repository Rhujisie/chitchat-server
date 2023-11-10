
const express = require('express')
const router = express.Router()
const {logout} = require('../controller/Logout')


router.get('/', logout)

module.exports = router