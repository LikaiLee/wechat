require('babel-core/register');
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const wechat = require('./wechat')
const config = require('./config')


const index = require('./routes/index')

// error handler
onerror(app)

// middlewares
app.use(bodyparser())
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// wechat
app.use(wechat(config.WECHAT))

// routes
app.use(index.routes(), index.allowedMethods())


module.exports = app