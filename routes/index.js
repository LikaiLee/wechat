const router = require('koa-router')()
const path = require('path')
const fs = require('fs')
const request = require('request')
const superagent = require('superagent')
const axios = require('axios')
const utils = require('../utils')
const { QQ_MUSIC } = require('../config')

router.get('/hotkey', async(ctx, next) => {
  const { data } = await axios({
    url: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',
    headers: QQ_MUSIC.HEADER_MOBILE,
    params: {
      g_tk: 5381,
      uin: 0,
      format: 'json',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      _: new Date().getTime()
    }
  })
  ctx.body = data
})

router.get('/album/:albumid', async(ctx, next) => {
  const { data } = await axios({
    url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg',
    headers: QQ_MUSIC.HEADER_MOBILE,
    params: {
      albumid: ctx.params.albumid,
      g_tk: 5381,
      uin: 0,
      format: 'json',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      _: new Date().getTime()
    }
  })
  ctx.body = data
})

router.get('/singer/:singermid', async(ctx, next) => {
  const { data } = await axios({
    url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',
    params: {
      singermid: ctx.params.singermid,
      g_tk: 5381,
      uin: 0,
      format: 'json',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'h5page',
      needNewCode: 1,
      order: 'listen',
      from: 'h5',
      num: 15,
      begin: 0,
      _: new Date().getTime()
    },
    headers: QQ_MUSIC.HEADER_MOBILE
  })

  ctx.body = data
})

router.get('/toplist/:topid', async(ctx, next) => {
  /**
   *  3  欧美
   *  4  流行指数
   *  5  内地
   *  6  港台
   *  16 韩国
   *  17 日本
   *  26 巅峰榜 热歌
   *  27 新歌
   *  28 网络歌曲
   *  30 梦想的声音
   *  36 K歌金曲
   *  52 腾讯音乐人原创榜
   *  
   */
  const { data } = await axios({
    url: `https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg`,
    params: {
      g_tk: 5381,
      uin: 0,
      format: 'json',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      tpl: 3,
      page: 'detail',
      type: 'top',
      topid: ctx.params.topid,
      _: new Date().getTime()
    },
    headers: QQ_MUSIC.HEADER_MOBILE
  })
  ctx.body = data

})

router.get('/toplistopt', async(ctx, next) => {
  const { data } = await axios({
    url: `https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_opt.fcg`,
    params: {
      page: 'index',
      format: 'html',
      tpl: 'macv4',
      v8debug: 1,
      jsonCallback:'jsonCallback'
    },
    headers: QQ_MUSIC.HEADER
  })
  ctx.body = data

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