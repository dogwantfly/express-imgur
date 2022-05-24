const sizeOf = require('image-size');
const { ImgurClient } = require('imgur');
const upload = require('../service/image');
const appError = require('../service/appError');
const handleSuccess = require('../service/sucessHandler');

const uploadController = {
  async uploadImage(req, res, next) {
  
    upload(req, res, async (err) => {
      if (err) {
        return next(appError(400, err, next));
      }
      if(!req.files.length) {
        return next(appError(400, "尚未上傳檔案", next));
      }
      const dimensions = sizeOf(req.files[0].buffer);
      const isAvatar = req.body.isAvatar;
      if(isAvatar && (dimensions.width !== dimensions.height)) {
        return next(appError(400, "圖片長寬不符合 1:1 尺寸。", next))
      }
      const client = new ImgurClient({
        clientId: process.env.IMGUR_CLIENTID,
        clientSecret: process.env.IMGUR_CLIENT_SECRET,
        refreshToken: process.env.IMGUR_REFRESH_TOKEN,
      });
      const response = await client.upload({
        image: req.files[0].buffer.toString('base64'),
        type: 'base64',
        album: process.env.IMGUR_ALBUM_ID
      });
   
      if (response.success) {
        handleSuccess(res, response.data.link, 200)
      } else {
        return next(appError(500, "系統錯誤，請恰系統管理員", next))
      }
    })
  }
}

module.exports = uploadController;