const express = require('express')
const path = require('path')
const jwt = require('jsonwebtoken')
const JSONdb = require('simple-json-db')
const db = new JSONdb(path.join(__dirname, '../data.json'))

const router = express.Router()

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
    const newValues = Object.values(req.body)

    const oldSkills = db.get('skills')

    const newSkills = Object.values(oldSkills).map((item, index) => ({ number: parseInt(newValues[index]), text: item.text }))

    if (JSON.stringify(newSkills) !== JSON.stringify(db.get('skills'))) {
        db.set('skills', newSkills)
        res.render('pages/admin', { title: 'Admin page', skills: newSkills, msgskill: 'Скиллы успешно обновлены' })
    } else {
        res.render('pages/admin', { title: 'Admin page', skills: newSkills, msgskill: 'В скиллах ничего не поменялось' })
    }
})

const textUploadFile = (msg) => {
    return { title: 'Admin page', skills: db.get('skills'), msgfile: msg }
}

router.post('/upload', (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.render('pages/admin', textUploadFile('Файл не загружен'))
    }
    let sampleFile = req.files.photo

    sampleFile.mv(path.join(__dirname, '../public/assets/img/products/', sampleFile.name), function(err) {
        if (err)
            return res.render('pages/admin', textUploadFile(err))

        if (req.body.name.length < 1 || req.body.price.length < 1) {
            return res.render('pages/admin', textUploadFile('Недопустимая длина полей'))
        }

        const price = parseInt(req.body.price)

        if (typeof price !== 'number') {
            return res.render('pages/admin', textUploadFile('Поле цены должно иметь числовое значение'))
        }

        const saveFile = {
            src: `./assets/img/products/${sampleFile.name}`,
            name: req.body.name,
            price: price
        }

        const products = db.get('products')

        db.set('products', products ? [...products, saveFile] : [saveFile])

        res.render('pages/admin', textUploadFile('Продукт успешно добавлен'))
    })
})

module.exports = router