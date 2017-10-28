const router = require('koa-router')()
const path = require('path')
const fs = require('fs')
const iconv = require('iconv-lite')
const request = require('request')
const superagent = require('superagent')
const axios = require('axios')
const utils = require('../utils')
const { QQ_MUSIC } = require('../config')

router.get('/music', async(ctx, next) => {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp'
  const headers = {
    'accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'accept-encoding':'gzip, deflate, br',
    'accept-language':'zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4',
    'cache-control':'max-age=0',
    'upgrade-insecure-requests':1,
    'user-agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
  }

  let { data } = await axios({
    url,
    headers,
    params: {
      ct: 24,
      qqmusic_ver: 1298,
      new_json: 1,
      remoteplace: 'txt.yqq.song',
      t: 0,
      aggr: 1,
      cr: 1,
      catZhida: 1,
      lossless: 0,
      flag_qc: 0,
      p: 1,
      n: 20,
      w: '林俊杰',
      g_tk: 5381,
      loginUin: 0,
      hostUin: 0,
      format: 'json',
      inCharset: 'utf8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'yqq',
      needNewCode: 0,
    }
  })
  ctx.body = data.data.song


})

router.get('/wechat', async(ctx, next) => {

  const filepath = path.join(__dirname, '../logo.png')
  // const res = fs.createReadStream(filepath)
  // console.log(res)
  /*request({
      method: 'POST',
      url: `https://api.weixin.qq.com/cgi-bin/media/upload?access_token=-W7GvYV6l4uw-_FnJu4t4-f4H7rA0jgCGxNpq94sVrmn2bVNGaaORq7T92Nhps4gjSWDpUDulwdu_YyA5RZnZ_fBGuuUYsJHyjkSPaQL4ipksmyBOSTJHwXkohs4OrkmQNEjAGAYVM&type=image`,
      formData: {
        media: fs.createReadStream(filepath)
      },
      json: true
    })
    .then(res => {
      console.log(res)
    })*/
  ctx.body = 'res';
});

module.exports = router;