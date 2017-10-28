const axios = require('axios')
const { QQ_MUSIC } = require('../config')

exports.searchMusic = async (keyword) => {
  // https://c.y.qq.com/soso/fcgi-bin/client_search_cp?ct=24&qqmusic_ver=1298&new_json=1&remoteplace=txt.yqq.song&t=0&aggr=1&cr=1&catZhida=1&lossless=0&flag_qc=0&p=1&n=20&w=%E6%9E%97%E4%BF%8A%E6%9D%B0&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0
  const { data } = await axios({
      url: 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp',
      method: 'GET',
      headers: QQ_MUSIC.HEADER,
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
        w: keyword,
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

  return data
}