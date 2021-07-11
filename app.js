const koa = require('koa')
const app = new koa()
const Pug = require('koa-pug')
const serve = require('koa-static')
const path = require('path')
const mainRouter = require('./routes/')
const bodyParser = require('koa-bodyparser')
const cookie = require('koa-cookie')
const logger = require('koa-logger')

const pug = new Pug({
    viewPath: path.join(__dirname, 'views'),
    basedir: path.join(__dirname, 'views'),
    app: app
})

app.use(logger())
app.use(cookie.default())
app.use(bodyParser())
app.use(serve(__dirname + '/public'))
app.use(mainRouter.routes())

app.listen(3000, () => {})