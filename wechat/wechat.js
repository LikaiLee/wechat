const fs = require('fs')
const path = require('path')
const util = require('util')
const superagent = require('superagent')
const axios = require('axios')
const service = require('../service/wechat')
const QQMuiscService = require('../service/QQMusic')
const utils = require('../utils')
const wxUtils = require('./wxUtils')

function Wechat(opts) {
  const self = this
  this.getAccessToken = opts.getAccessToken;
  this.saveAccessToken = opts.saveAccessToken

  this.fetchAccessToken()

}
/**
 * [fetchAccessToken 刚开始实例化时生成access_token ]
 * 当用到时检查其是否有效，若无效进行更新
 * @return {[type]} [description]
 */
Wechat.prototype.fetchAccessToken = function() {
  const self = this;
  if (this.access_token && this.expires_in) {
    if (this.isValidAccessToken(this)) {
      return Promise.resolve(this);
    }
  }

  return this.getAccessToken()
    .then(data => {
      try {
        data = JSON.parse(data)
        return Promise.resolve(data)
      } catch (e) {
        // console.log('> read data error')
        return self.updateAccessToken(self)
      }
    })
    .then(data => {
      if (self.isValidAccessToken(data)) {
        return Promise.resolve(data)
      } else {
        // console.log('> access_token is outdated')
        return self.updateAccessToken(self)
      }
    })
    .then(data => {
      console.log('> valid access_token')
      self.access_token = data.access_token;
      self.expires_in = data.expires_in;
      return Promise.resolve(data);
    })
    .catch(err => {
      return Promise.reject(err)
    })
}


Wechat.prototype.updateAccessToken = (self) => {
  return new Promise((resolve, reject) => {
    service.getAccessToken()
      .then(data => {
        console.log('> invalid access_token, about to update access_token');
        const now = new Date().getTime()
        let expires_in = now + (data.expires_in - 20) * 1000
        data.expires_in = expires_in
        self.saveAccessToken(JSON.stringify(data))
        console.log('> update access_token successfully')
        resolve(data)
      })
  })
}
Wechat.prototype.isValidAccessToken = data => {

  let { access_token, expires_in } = data
  if (!access_token || !expires_in) {
    return false
  }
  const now = new Date().getTime()
  if (now < expires_in) {
    return true
  } else {
    return false
  }
}

/**
 * [reply 回复消息]
 * @param  {[type]} ctx         [description]
 * @param  {[type]} fromUserMsg [description]
 * @return {[type]}             [description]
 */
Wechat.prototype.reply = async function(ctx, fromUserMsg) {
  const self = this
  let replyMsg = '回复 music/kb 关键词'
  let { MsgType, Event } = fromUserMsg
  if (MsgType === 'event') {
    replyMsg = await wxUtils.handleEvent(Event, fromUserMsg)
  }
  if (MsgType === 'text') {
    const keyword = fromUserMsg.Content

    if (keyword.startsWith('kb')) {
      replyMsg = await wxUtils.handleTimeTable(keyword)
    }
    if (keyword.startsWith('music')) {
      const key = keyword.split('music')[1].trim()
      const data = await QQMuiscService.searchMusic(key)
      replyMsg = await wxUtils.handleMusic(data, key)
    }
  }

  wxUtils.replyMessage.call(ctx, replyMsg, fromUserMsg)
}

/**
 * [uploadTempMaterail 上传临时素材]
 * @param  {[type]} ctx [description] image video music...
 * @return {[type]}     [description]
 */
Wechat.prototype.uploadTempMaterail = async function(type, filepath) {
  return await service.uploadTempMaterail(type, filepath, this.access_token)
}

/**
 * [上传永久素材]
 * @param  {[type]} type [uploadimg, add_news, add_material]
 * @param  {[type]} form [description]
 * @return {[type]}      [description]
 */
Wechat.prototype.uploadPermanentMaterail = async function(type, form) {
  return await service.uploadPermanentMaterail(type, form, this.access_token)
}

module.exports = Wechat
