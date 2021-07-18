const express = require('express')
const controllers = require('../controllers')

const router = express.Router()

router.post('/login', controllers.login.getLogin)

router.post('/registration', controllers.register.getRegister)

module.exports = router