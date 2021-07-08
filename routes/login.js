const express = require('express')
const router = express.Router()
const path = require('path')
const JSONdb = require('simple-json-db')
const db = new JSONdb(path.join(__dirname, '../data.json'))

router.get('/', (req, res, next) => {
    res.render('pages/login', { title: 'SigIn page' })
})

router.post('/', (req, res, next) => {
    const { email, password } = req.body
    const admin = db.get('admin')

    if (admin.email === email && admin.password === password) {
        res.redirect(301, '/admin')
    } else {
        res.send('Неверный email или пароль')
    }

})

module.exports = router