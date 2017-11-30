const path = require('path')
const utils = require('../utils')
const wechat_file_path = path.join(__dirname, './wechat.txt')

const config = {
  BASE_API: 'https://api.weixin.qq.com/',
  WECHAT: {
    TOKEN: 'likailee2017wexintoken',
    APP_ID: 'wx1cdba5f9a9121be0',
    APP_SECRET: '7512592bebedc18e26de8125d5f3dccc',
    ACCESS_TOKEN_URL: 'cgi-bin/token', // 获取access_token
    WEIXIN_SERVER_URL: 'cgi-bin/getcallbackip', // 获取微信服务器IP
    UPLOAD_TEMP_URL: 'cgi-bin/media/upload', // 上传临时素材
    UPLOAD_PERMANENT: {// 上传永久素材
      PREFIX: 'cgi-bin/media/',
      UPLOAD_IMG: 'cgi-bin/media/uploadimg',
      ADD_NEWS_URL: 'cgi-bin/material/add_news',
      ADD_MATERIAL: 'cgi-bin/material/add_material'
    },
    CREATE_MENU: 'cgi-bin/menu/create',// 创建菜单
    getAccessToken: () => {
      return utils.readFileAsync(wechat_file_path, 'utf-8')
    },
    saveAccessToken: (data) => {
      return utils.writeFileAsync(wechat_file_path, data)
    }
  },
  QQ_MUSIC: {
    HEADER: {
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4',
      'cache-control': 'max-age=0',
      'upgrade-insecure-requests': 1,
      'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
    },
    HEADER_MOBILE: {
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4',
      'cache-control': 'max-age=0',
      'upgrade-insecure-requests': '1',
      'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Mobile Safari/537.36',
    }
  }
}

module.exports = config