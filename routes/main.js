const express = require('express')
const path = require('path')
const JSONdb = require('simple-json-db')
const db = new JSONdb(path.join(__dirname, '../data.json'))

const router = express.Router()

router.get('/', (req, res, next) => {
    res.render('pages/index', { title: 'Main page', products: db.get('products'), skills: db.get('skills') })
})

router.post('/', (req, res, next) => {
    const { name, email, message } = req.body

    if (name.length > 0 && email.length > 0 & message.length > 0) {
        const message = db.get('messages')
        db.set('messages', message ? [...message, req.body] : [req.body])
        res.render('pages/index', { title: 'Main page', products: db.get('products'), skills: db.get('skills'), msgemail: 'Письмо отправлено' })
    } else {
        res.render('pages/index', { title: 'Main page', products: db.get('products'), skills: db.get('skills'), msgemail: 'Ошибка заполенения' })
    }
})

module.exports = router