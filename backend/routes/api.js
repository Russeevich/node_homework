const express = require('express')
const controllers = require('../controllers')
let multer = require('multer')
const path = require('path')
let upload = multer({ dest: path.join(__dirname, '../uploads') })

const router = express.Router()


//AUTH
router.post('/login', controllers.login.getLogin)

router.post('/registration', controllers.register.getRegister)

router.post('/refresh-token', controllers.refreshToken.getRefresh)

//PROFILE

router.get('/profile', controllers.profile.getProfile)

router.patch('/profile', upload.fields([{ name: 'avatar' }]), controllers.profile.updateProfile)

//USERS

router.get('/users', controllers.users.getUsers)

router.patch('/users/:id/permission', controllers.users.setUserPermission)

router.delete('/users/:id', controllers.users.deleteUser)

//NEWS

router.get('/news', controllers.news.getNews)

router.post('/news', controllers.news.addNews)

router.patch('/news/:id', controllers.news.updateNews)

router.delete('/news/:id', controllers.news.deleteNews)

module.exports = router