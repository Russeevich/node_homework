const Router = require('koa-router')
const KoaBody = require('koa-body')
const path = require('path')
const jwt = require('jsonwebtoken')
const convert = require('koa-convert')
const JSONdb = require('simple-json-db')
const db = new JSONdb(path.join(__dirname, '../data.json'))

const router = new Router(),
    koaBody = convert(KoaBody())

router
    .get('/', async(ctx, next) => {
        try {
            if (ctx.cookie.authorization) {
                const { data } = jwt.verify(ctx.cookie.authorization, 'loftschool')
                const admin = db.get('admin')

                if (admin.email !== data.email || admin.password !== data.password) {
                    throw new Error('Неправильный токен')
                } else {
                    ctx.redirect('/admin')
                }
            }
        } catch (err) {
            ctx.cookies.set('authorization', '')
        }
        await ctx.render('pages/login', { title: 'SigIn page' })
    })
    .post('/', async(ctx, next) => {
        const { email, password } = ctx.request.body
        const admin = db.get('admin')

        if (admin.email === email && admin.password === password) {
            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                data: {
                    email,
                    password
                }
            }, 'loftschool')
            ctx.cookies.set('authorization', token)
            ctx.redirect('/admin')
        } else {
            await ctx.render('pages/admin', { title: 'Login page', msglogin: 'Неверный email или пароль' })
        }
    })

module.exports = {
    routes() { return router.routes() }
}