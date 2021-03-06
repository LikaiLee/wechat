const xml2js = require('xml2js')
const sha1 = require('sha1');
const axios = require('axios')
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
        // console.log(content.xml)
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

exports.handleEvent = async(Event, fromUserMsg) => {
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
      let time = new Date(fromUserMsg.CreateTime * 1000).toLocaleString()
      replyMsg = `latitude = ${fromUserMsg.Latitude}
longitude = ${fromUserMsg.Longitude}
precision = ${fromUserMsg.Precision}
time = ${time}`
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

exports.handleMusic = async(data, keyword) => {
  let replyMsg = ' '
  const totalNum = data.data.song.totalnum
  if (totalNum > 0) {
    let baseMsg = `共有 ${totalNum} 首关于 ${keyword} 的音乐`
    if (totalNum > 1) {
      baseMsg += '， 先来三条哈'
    }
    const count = totalNum >= 3 ? 3 : 1
    const song = data.data.song
    for (let i = 0; i < count; i++) {
      const record = song.list[i]
      const musicId = record.file.strMediaMid
      const songName = record.title
      const album = record.album.title
      const photoId = record.album.mid
      const singers = record.singer
      let singer = ''
      singers.forEach(s => {
        singer += s.name + ' '
      })
      const musicUrl = `http://isure.stream.qqmusic.qq.com/C100${musicId}.m4a?fromtag=32`
      // const musicUrl = `http://ws.stream.qqmusic.qq.com/C100${musicId}.m4a?fromtag=38`

      replyMsg +=
        `\n 歌名：${songName}
 专辑：${album}
 歌手：${singer}
 链接：${musicUrl}
 海报：https://y.gtimg.cn/music/photo_new/T002R300x300M000${photoId}.jpg?max_age=2592000
 --------------------------------`
    }

    replyMsg = baseMsg + replyMsg
  } else {
    replyMsg = `找不到关于 ${keyword} 的音乐`
  }

  return replyMsg
}

exports.handleTimeTable = async(keyword) => {
  let replyMsg = ''
  const stuInfo = keyword.split('kb')[1].trim()
  const stuId = stuInfo.split(' ')[0]
  const pwd = stuInfo.split(' ')[1]
  const timeTable = await axios.get(`http://120.24.250.209:233/${stuId}/${pwd}`)
  if (timeTable.data.statusCode === 200) {
    const table = timeTable.data.response
    table.forEach(t => {
      replyMsg += `
课程：${t.course}
教室：${t.classroom}
老师：${t.teacher}
时间：${t.duration}`
    })
  } else {
    replyMsg = '学号或密码错误'
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
    if(typeof value === 'string') {
      fmtMsg[key] = (value || '').trim()
    } else {
      fmtMsg[key] = value
    }
  })
  
  return fmtMsg;
}