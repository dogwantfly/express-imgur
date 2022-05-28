const handleErrorAsync = require('../service/handleErrorAsync');
const appError = require('../service/appError');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const handleSuccess = require('../service/sucessHandler');

const isAuth = handleErrorAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(appError(401, "您尚未登入", next))
  }

  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        setTimeout(reject(err), 500)
      } else {
        resolve(payload);
      }
    })
  })
  const currentUser = await User.findById(decoded.id);
  req.user = currentUser;
  next()
})

const generateSendJWT = (res, statusCode, user) => {
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_DAY }
  )
  user.password = undefined;
  handleSuccess(res, user, statusCode, token);
}

module.exports = { isAuth, generateSendJWT };