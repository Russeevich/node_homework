const express = require('express')
const router = express.Router()
const path = require('path')
const JSONdb = require('simple-json-db')
const db = new JSONdb(path.join(__dirname, '../data.json'))

router.get('/', (req, res, next) => {
    res.render('pages/index', { title: 'Main page', products: db.get('products'), skills: db.get('skills') })
})

router.post('/', (req, res, next) => {
    const { name, email, message } = req.body


    if (name.length > 0 && email.length > 0 & message.length > 0) {
        db.set('messages', db.get('messages') ? [...db.get('messages'), req.body] : [req.body])
        res.send('Письмо отправленно')
    } else {
        res.send('Ошибка заполнения данных')
    }
})

module.exports = router