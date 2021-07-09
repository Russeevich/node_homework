const express = require('express')
const router = express.Router()
const path = require('path')
const jwt = require('jsonwebtoken')
const JSONdb = require('simple-json-db')
const db = new JSONdb(path.join(__dirname, '../data.json'))

router.get('/', (req, res, next) => {
    try {
        if (req.cookies.authorization) {
            const { data } = jwt.verify(req.cookies.authorization, 'loftschool'),
                admin = db.get('admin')

            if (admin.email !== data.email || admin.password !== data.password) {
                throw new Error('Неправильный токен')
            } else {
                res.redirect(301, '/admin')
            }
        }
    } catch (err) {
        res.cookie('authorization', '')
    }
    res.render('pages/login', { title: 'SigIn page' })
})

router.post('/', (req, res, next) => {
    const { email, password } = req.body
    const admin = db.get('admin')

    if (admin.email === email && admin.password === password) {
        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: {
                email,
                password
            }
        }, 'loftschool')
        res.cookie('authorization', token)
        res.redirect(301, '/admin')
    } else {
        res.send('Неверный email или пароль')
    }

})

module.exports = router