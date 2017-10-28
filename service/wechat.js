const fs = require('fs')
const request = require('request')
const fetch = require('../utils/fetch');
const { BASE_API, WECHAT } = require('../config');
const {
  APP_ID,
  APP_SECRET,
  ACCESS_TOKEN_URL,
  WEIXIN_SERVER_URL,
  UPLOAD_TEMP_URL,
  UPLOAD_PERMANENT
} = WECHAT

/**
 * [获取access_token]
 * @return {[type]} [description]
 */
exports.getAccessToken = async() => {
  const { data } = await fetch({
    method: 'GET',
    url: ACCESS_TOKEN_URL,
    params: {
      grant_type: 'client_credential',
      appid: APP_ID,
      secret: APP_SECRET
    }
  });
  return data

}
/**
 * [获取微信服务器IP]
 * @param  {[type]} access_token [description]
 * @return {[type]}              [description]
 */
exports.getWeixinServer = async(access_token) => {
  const { data } = await fetch({
    method: 'GET',
    url: WEIXIN_SERVER_URL,
    params: {
      access_token
    }
  })
  return data;
}
/**
 * [上传临时素材]
 * @param  {[type]} type         [description]
 * @return {[type]}              [description]
 */
exports.uploadTempMaterail = (type, filepath, access_token) => {
  return new Promise((resolve, reject) => {
    request({
      method: 'POST',
      url: `${BASE_API}${UPLOAD_TEMP_URL}?access_token=${access_token}&type=${type}`,
      formData: {
        media: fs.createReadStream(filepath)
      },
      json: true
    }, (err, response, body) => {
      if (err) {
        reject(err)
      } else {
        resolve(body)
      }
    })
  })
}

exports.uploadPermanentMaterail = (type, form, access_token) => {
  return new Promise((resolve, reject) => {
    request({
      method: 'POST',
      url: `${BASE_API}${UPLOAD_PERMANENT.PREFIX}${type}?access_token=${access_token}`,
      formData: form,
      json: true
    }, (err, response, body) => {
      if (err) {
        reject(err)
      } else {
        // console.log(body)
        resolve(body)
      }
    })
    // resolve(`${BASE_API}${type}?access_token=${access_token}`)
  })
}