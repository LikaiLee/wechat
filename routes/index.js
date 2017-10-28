const router = require('koa-router')()
const path = require('path')
const request = require('request')
const fs = require('fs')

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