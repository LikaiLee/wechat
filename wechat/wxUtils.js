const xml2js = require('xml2js')
const sha1 = require('sha1');
const compileTpl = require('./tpl')
const { WECHAT } = require('../config');
const { TOKEN } = WECHAT

/**
 * [验证请求是否来自微信]
 * @param  {[type]} options.query [ctx.query]
 * @return {[type]}               [description]
 */
exports.auth = ({ query }) => {
  const { signature, echostr, timestamp, nonce } = query;
  let arr = [TOKEN, timestamp, nonce];
  let str = arr.sort().join('');
  let cryptedStr = sha1(str);

  if (signature === cryptedStr) {
    return {
      isFromWechat: true,
      echoStr: echostr
    }
  } else {
    return {
      isFromWechat: false,
      echoStr: {
        errcode: 400,
        msg: 'error request'
      }
    }
  }
}

/**
 * [将xml转为JSON]
 * @param  {[type]} xml [description]
 * @return {[type]}     [description]
 */
exports.parseXMLAsync = xml => {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, { trim: true }, (err, content) => {
      if (err) {
        reject(err)
      } else {
        const fromUserMsg = _formatMessage(content.xml)
        resolve(fromUserMsg)
      }
    })
  })
}
/**
 * [replyMessage 回复用户信息]
 * @param  {[type]} replyMsg    [description]
 * @param  {[type]} fromUserMsg [description]
 * @return {[type]}             [description]
 */
exports.replyMessage = function(replyMsg, fromUserMsg) {
  const ctx = this
  const { FromUserName, ToUserName } = fromUserMsg
  let type = Array.isArray(replyMsg) ? 'news' : 'text'
  type = replyMsg.type || type

  const info = {
    content: replyMsg,
    msgType: type,
    createTime: new Date().getTime(),
    fromUserName: ToUserName,
    toUserName: FromUserName
  }

  const xml = compileTpl(info)
  ctx.status = 200
  ctx.type = 'application/xml'
  ctx.body = xml
  // console.log(ctx.body)
}

exports.handleEvent = async (Event, fromUserMsg) => {
  let replyMsg = 'welcome'
  switch (Event) {
      case 'subscribe':
        replyMsg = '欢迎关注我的公众号：\n回复关键词搜索歌曲'
        break;
      case 'unsubscribe':
        console.log('unsubscribe')
        replyMsg = ''
        break;
      case 'LOCATION':
        replyMsg = `latitude = ${fromUserMsg.Latitude}
         - longitude = ${fromUserMsg.Longitude}
         - ${fromUserMsg.Precision}`
        break;
      case 'CLICK':
        replyMsg = `您点击了菜单：${fromUserMsg.EventKey}`
        break;
      case 'SCAN':
        replyMsg = `scan ${fromUserMsg.EventKey} ${fromUserMsg.Ticket}`
        break;
      case 'VIEW':
        replyMsg = `您点击了菜单中的链接 ${fromUserMsg.EventKey}`
        break;
    }
    return replyMsg
}

exports.handleTextMsg = (content) => {
  let replyMsg = ''
  switch (content) {
      case '1':
        replyMsg = '天下第1吃大米'
        break;
      case '2':
        replyMsg = '天下第2吃豆腐'
        break;
      case '3':
        replyMsg = '天下第3吃仙丹'
        break;
      case '4':
        replyMsg = [{
            title: '技术改变世界',
            description: '是的嘛',
            picUrl: 'https://res.wx.qq.com/mpres/htmledition/images/bg/bg_logo318e8e.png',
            url: 'https://www.github.com'
          },
          {
            title: 'NodeJS',
            description: '是的啊',
            picUrl: 'http://mmbiz.qpic.cn/mmbiz_jpg/uOuD3pg5nOicX1U8BTOpxv7QwlgxiaBYqQcWIWPUVkrcC0KCVtpSA77waf5cONDdFicBwDibV4OKSAy5wEOKJHDQvA/0',
            url: 'https://www.baidu.com'
          }
        ]
        break;
      case '5':
        // const filepath = path.join(__dirname, './logo.png')
        // const res = await this.uploadTempMaterail('image', filepath)
        replyMsg = {
          type: 'image',
          // mediaId: res.media_id
          mediaId: 'ESkpBMWozyW8q1Ah0q9yoxRJ1ttQTgRTWbYUVyy9bKLqzpRgh6JmzH49RM-ggpk2'
        }
        // console.log(res)

        break;
      case '6':
        // const filepath = path.join(__dirname, './video.mp4')
        // const res = await this.uploadTempMaterail('video', filepath)
        // console.log(res)
        replyMsg = {
          type: 'video',
          title: '回复视频内容',
          description: 'APP 介绍',
          // mediaId: res.media_id
          mediaId: 'h8NCbl1SbWKzCeBgH-kfDbADpXCvla5PzL6nO1A25TdNVO8cQiYiSpaPvjNsfwvl'
        }
        break;
      case '7':
        replyMsg = {
          type: 'music',
          title: 'look what you make me do',
          description: 'Taylor Swift',
          musicUrl: 'http://isure.stream.qqmusic.qq.com/C100003hvIkL1QiILk.m4a?fromtag=32',
          // hqMusicUrl: '',
          thumbMediaId: 'DrDpOdhfhqfwsySFuZeE4YWtsL5xH6LAjoT4hAkvZhMIyHMwpO0T0N6BTcAx5nzk'
        }
        break;
      // case '8':
      //     const filepath = path.join(__dirname, './music_cover.jpg')
      //     const form = {
      //       media: fs.createReadStream(filepath)
      //     }
      //     const res = await this.uploadPermanentMaterail('uploadimg', form)
      //     console.log(res)
      //     replyMsg = res
      //   break;
      default:
        replyMsg = `你说的是： ${content}`
        break;
    }

    return replyMsg
}




const _formatMessage = message => {
  let fmtMsg = {}
  if (typeof message !== 'object') {
    return
  }

  Object.keys(message).forEach((key, index) => {
    let value = message[key][0];
    fmtMsg[key] = (value || '').trim()
  })

  return fmtMsg;
}