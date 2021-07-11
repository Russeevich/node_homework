const Router = require('koa-router')
const KoaBody = require('koa-body')
const path = require('path')
const convert = require('koa-convert')
const JSONdb = require('simple-json-db')
const db = new JSONdb(path.join(__dirname, '../data.json'))

const router = new Router(),
    koaBody = convert(KoaBody())


router.use('/', require('./main').routes())
router.use('/login', require('./login').routes())
router.use('/admin', require('./admin').routes())

// router
//     .get('/', async(ctx, next) => {
//         await ctx.render('pages/index', { title: 'Main page', products: db.get('products'), skills: db.get('skills') })
//     })
//     .get('/admin', async(ctx, next) => {
//         await ctx.render('pages/admin', { title: 'Admin page', skills: db.get('skills') })
//     })
//     .get('/login', async(ctx, next) => {
//         await ctx.render('pages/login', { title: 'SigIn page' })
//     })

module.exports = {
    routes() { return router.routes() }
}