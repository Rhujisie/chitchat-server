const express = require('express')
const router = express.Router()

const {getPeople} = require('../controller/People')

router.get('/', getPeople)


module.exports = router