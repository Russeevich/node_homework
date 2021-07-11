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
            const { data } = jwt.verify(ctx.cookie.authorization, 'loftschool'),
                admin = db.get('admin')

            if (admin.email !== data.email || admin.password !== data.password) {
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
        let newValues = Object.values(ctx.request.body),
            oldSkills = db.get('skills'),
            newSkills = Object.values(oldSkills).map((item, index) => ({ number: parseInt(newValues[index]), text: item.text }))

        if (JSON.stringify(newSkills) !== JSON.stringify(db.get('skills'))) {
            db.set('skills', newSkills)
            ctx.redirect('/admin')
        } else {
            ctx.body = 'В скиллах ничего не поменялось'
        }
    })
    .post('/upload', koaBody, async(ctx, next) => {
        if (!ctx.request.files || Object.keys(ctx.request.files).length === 0) {
            return ctx.body = 'Файл не загружен'
        }

        if (ctx.request.body.name.length < 1 || ctx.request.body.price.length < 1) {
            return ctx.body = 'Недопустимая длина полей'
        }

        let sampleFile = ctx.request.files.photo



        try {
            ctx.body = await new Promise((res, rej) => {
                fs.rename(sampleFile.path, path.join(productPath, sampleFile.name), (err) => {
                    if (err)
                        rej(err)

                    const saveFile = {
                        src: `./assets/img/products/${sampleFile.name}`,
                        name: ctx.request.body.name,
                        price: ctx.request.body.price
                    }

                    db.set('products', db.get('products') ? [...db.get('products'), saveFile] : [saveFile])

                    res('Продукт успешно добавлен')
                })
            })
        } catch (err) {
            ctx.body = err
        }
    })

module.exports = {
    routes() { return router.routes() }
}