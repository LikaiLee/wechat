const getRawBody = require('raw-body')
const path = require('path')
const fs = require('fs')
const wxUtils = require('./wxUtils')
const Wechat = require('./wechat')
const utils = require('../utils')

module.exports = (opts) => {

  const wechat = new Wechat(opts)
  // wechat.createMenu()
  
  return async(ctx, next) => {
    const { isFromWechat, echoStr } = wxUtils.auth(ctx)
    console.log('> isFromWechat: ' + isFromWechat)
    if (ctx.method !== 'POST' || !isFromWechat) {
      ctx.body = echoStr
      return
    }

    const rawBody = await getRawBody(ctx.req)
    const fromUserMsg = await wxUtils.parseXMLAsync(rawBody)
    console.log(fromUserMsg)

    await wechat.reply(ctx, fromUserMsg)

  }
}