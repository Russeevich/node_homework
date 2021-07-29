const express = require('express')
const controllers = require('../controllers')
const multer = require('multer')
const path = require('path')
const upload = multer({ dest: path.join(__dirname, '../uploads') })
const { authMiddle, perMiddle } = require('../middleware')

const router = express.Router()


//AUTH
router.post('/login',
    controllers.login.getLogin
)

router.post('/registration',
    controllers.register.getRegister
)

router.post('/refresh-token',
    authMiddle.getAuth,
    controllers.refreshToken.getRefresh
)

//PROFILE

router.get('/profile',
    authMiddle.getAuth,
    controllers.profile.getProfile
)

router.patch('/profile',
    upload.fields([{ name: 'avatar' }]),
    authMiddle.getAuth,
    controllers.profile.updateProfile
)

//USERS

router.get('/users',
    authMiddle.getAuth,
    perMiddle.admin,
    controllers.users.getUsers
)

router.patch('/users/:id/permission',
    authMiddle.getAuth,
    perMiddle.admin,
    controllers.users.setUserPermission
)

router.delete('/users/:id',
    authMiddle.getAuth,
    perMiddle.admin,
    controllers.users.deleteUser
)

//NEWS

router.get('/news',
    authMiddle.getAuth,
    perMiddle.news,
    controllers.news.getNews
)

router.post('/news',
    authMiddle.getAuth,
    perMiddle.news,
    controllers.news.addNews
)

router.patch('/news/:id',
    authMiddle.getAuth,
    perMiddle.news,
    controllers.news.updateNews
)

router.delete('/news/:id',
    authMiddle.getAuth,
    perMiddle.news,
    controllers.news.deleteNews
)

module.exports = router