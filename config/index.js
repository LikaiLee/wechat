const path = require('path')
const utils = require('../utils')
const wechat_file_path = path.join(__dirname, './wechat.txt')

const config = {
  BASE_API: 'https://api.weixin.qq.com/',
  WECHAT: {
    TOKEN: 'likailee2017wexintoken',
    APP_ID: 'wx91bc09bdf1fa51f8',
    APP_SECRET: '9a343e591e14a706a7cc2279400422b4',
    ACCESS_TOKEN_URL: 'cgi-bin/token', // 获取access_token
    WEIXIN_SERVER_URL: 'cgi-bin/getcallbackip', // 获取微信服务器IP
    UPLOAD_TEMP_URL: 'cgi-bin/media/upload', // 上传临时素材
    UPLOAD_PERMANENT: {
      PREFIX: 'cgi-bin/media/',
      UPLOAD_IMG: 'cgi-bin/media/uploadimg',
      ADD_NEWS_URL: 'cgi-bin/material/add_news',
      ADD_MATERIAL: 'cgi-bin/material/add_material'
    },
    getAccessToken: () => {
      return utils.readFileAsync(wechat_file_path, 'utf-8')
    },
    saveAccessToken: (data) => {
      return utils.writeFileAsync(wechat_file_path, data)
    }
  },
  QQ_MUSIC: {
    HEADER: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4',
      'Cache-Control': 'max-age=0',
      'Connection': 'keep-alive',
      'Host': 's.music.qq.com',
      'Upgrade-Insecure-Requests': 1,
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
    }
  }
}

module.exports = config