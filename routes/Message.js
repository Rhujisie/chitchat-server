const express = require('express')
const router = express.Router()

const {getMessage} = require('../controller/Message')

router.get('/:id', getMessage)

module.exports = router