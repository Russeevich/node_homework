const Router = require('koa-router')
const KoaBody = require('koa-body')
const path = require('path')
const convert = require('koa-convert')
const jwt = require('jsonwebtoken')
const JSONdb = require('simple-json-db')
const db = new JSONdb(path.join(__dirname, '../data.json'))
const fs = require('fs')
const productPath = path.join(__dirname, '../public/assets/img/products/')

const router = new Router(),
    koaBody = convert(KoaBody({ multipart: true, formidable: { uploadDir: productPath }, urlencoded: true }))

router
    .get('/', async(ctx, next) => {
        try {
            if (!ctx.cookie.authorization) {
                throw new Error('Нет прав для входа')
            }
            const { data } = jwt.verify(ctx.cookie.authorization, 'loftschool')
            const admin = db.get('admin')

            if (admin.email !== data.email) {
                throw new Error('Нет прав для доступа')
            }

            await ctx.render('pages/admin', { title: 'Admin page', skills: db.get('skills') })
        } catch (err) {
            if (typeof err === 'object' && !Object.keys(err).length) {
                ctx.body = 'Нет прав для входа'
            } else {
                ctx.body = err
            }
        }
    }).post('/skills', async(ctx, next) => {
        const newValues = Object.values(ctx.request.body)

        const oldSkills = db.get('skills')

        const newSkills = Object.values(oldSkills).map((item, index) => ({ number: newValues[index], text: item.text }))

        if (JSON.stringify(newSkills) !== JSON.stringify(db.get('skills'))) {
            db.set('skills', newSkills)
            await ctx.render('pages/admin', { title: 'Admin page', skills: db.get('skills'), msgskill: 'Скиллы успешно обновлены' })
        } else {
            await ctx.render('pages/admin', { title: 'Admin page', skills: db.get('skills'), msgskill: 'В скиллах ничего не поменялось' })
        }
    })
    .post('/upload', koaBody, async(ctx, next) => {
        if (!ctx.request.files || Object.keys(ctx.request.files).length === 0) {
            return await ctx.render('pages/admin', { title: 'Admin page', skills: db.get('skills'), msgfile: 'Файл не загружен' })
        }

        if (ctx.request.body.name.length < 1 || ctx.request.body.price.length < 1) {
            return await ctx.render('pages/admin', { title: 'Admin page', skills: db.get('skills'), msgfile: 'Недопустимая длина полей' })
        }

        const price = parseInt(ctx.request.body.price)

        if (typeof price !== 'number') {
            return await ctx.render('pages/admin', { title: 'Admin page', skills: db.get('skills'), msgfile: 'Цена должна иметь числовое значение' })
        }

        let sampleFile = ctx.request.files.photo

        try {
            const message = await new Promise((res, rej) => {
                fs.rename(sampleFile.path, path.join(productPath, sampleFile.name), (err) => {
                    if (err)
                        rej(err)

                    const saveFile = {
                        src: `./assets/img/products/${sampleFile.name}`,
                        name: ctx.request.body.name,
                        price: ctx.request.body.price
                    }

                    const prevProducts = db.get('products') || []

                    db.set('products', prevProducts ? [...prevProducts, saveFile] : [saveFile])

                    res('Продукт успешно добавлен')
                })
            })
            await ctx.render('pages/admin', { title: 'Admin page', skills: db.get('skills'), msgfile: message })
        } catch (err) {
            await ctx.render('pages/admin', { title: 'Admin page', skills: db.get('skills'), msgfile: err })
        }
    })

module.exports = {
    routes() { return router.routes() }
}