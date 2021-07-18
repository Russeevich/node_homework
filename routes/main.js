const Router = require('koa-router')
const KoaBody = require('koa-body')
const path = require('path')
const convert = require('koa-convert')
const JSONdb = require('simple-json-db')
const db = new JSONdb(path.join(__dirname, '../data.json'))

const router = new Router(),
    koaBody = convert(KoaBody())

router
    .get('/', async(ctx, next) => {
        await ctx.render('pages/index', { title: 'Main page', products: db.get('products'), skills: db.get('skills') })
    })
    .post('/', async(ctx, next) => {
        const { name, email, message } = ctx.request.body

        if (name.length > 0 && email.length > 0 & message.length > 0) {
            const messages = db.get('messages')
            db.set('messages', messages ? [...messages, ctx.request.body] : [ctx.request.body])
            await ctx.render('pages/index', { title: 'Main page', products: db.get('products'), skills: db.get('skills'), msgemail: 'Сообщение успешно отправлено' })
        } else {
            await ctx.render('pages/index', { title: 'Main page', products: db.get('products'), skills: db.get('skills'), msgemail: 'Ошибка заполнения данных' })
        }
    })

module.exports = {
    routes() { return router.routes() }
}