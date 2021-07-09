const express = require('express')
const router = express.Router()
const path = require('path')
const jwt = require('jsonwebtoken')
const JSONdb = require('simple-json-db')
const db = new JSONdb(path.join(__dirname, '../data.json'))

router.get('/', (req, res, next) => {
    try {
        if (!req.cookies.authorization) {
            throw new Error('Нет прав для входа')
        }
        const { data } = jwt.verify(req.cookies.authorization, 'loftschool'),
            admin = db.get('admin')

        if (admin.email !== data.email || admin.password !== data.password) {
            throw new Error('Нет прав для доступа')
        }

        res.render('pages/admin', { title: 'Admin page', skills: db.get('skills') })
    } catch (err) {
        if (typeof err === 'object' && !Object.keys(err).length) {
            res.send('Нет прав для входа')
        } else {
            res.send(err)
        }
    }
})

router.post('/skills', (req, res, next) => {
    let newValues = Object.values(req.body),
        oldSkills = db.get('skills'),
        newSkills = Object.values(oldSkills).map((item, index) => ({ number: parseInt(newValues[index]), text: item.text }))

    if (JSON.stringify(newSkills) !== JSON.stringify(db.get('skills'))) {
        db.set('skills', newSkills)
        res.redirect(301, '/admin')
    } else {
        res.send('В скиллах ничего не поменялось')
    }
})

router.post('/upload', (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('Файл не загружен')
    }
    let sampleFile = req.files.photo

    sampleFile.mv(path.join(__dirname, '../public/assets/img/products/', sampleFile.name), function(err) {
        if (err)
            return res.status(500).send(err)

        if (req.body.name.length < 1 || req.body.price.length < 1) {
            return res.status(400).send('Недопустимая длина полей')
        }

        const saveFile = {
            src: `./assets/img/products/${sampleFile.name}`,
            name: req.body.name,
            price: req.body.price
        }

        db.set('products', db.get('products') ? [...db.get('products'), saveFile] : [saveFile])

        res.send('Продукт успешно добавлен')
    })
})

module.exports = router