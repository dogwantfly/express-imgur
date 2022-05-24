const bcrypt = require('bcryptjs');
const validator = require('validator');
const appError = require('../service/appError');
const handleSuccess = require('../service/sucessHandler');
const User = require('../models/users');
const { generateSendJWT } = require('../middlewares/auth');



const userController = {
  async signUp(req, res, next) {
    let { email, password, confirmPassword, name } = req.body;
    if (!email || !password || !confirmPassword || !name) {
      return next(appError(400, "請輸入必填欄位：Email、密碼、暱稱", next))
    }
    if(!validator.equals(confirmPassword, password)){
      return next(appError(400, "密碼不一致！", next));
    }
    if(!validator.isLength(password, { min: 8 }) || !validator.isAlphanumeric(password)){
      return next(appError(400, "密碼需至少 8 碼以上，並英數混合", next));
    }
    if(validator.isAlpha(password) || validator.isNumeric(password)){
      return next(appError(400, "密碼需英數混合", next));
    }
    if(!validator.isEmail(email)){
      return next(appError(400, "Email 格式不正確", next));
    }
    if(!validator.isLength(name, { min: 2 })){
      return next(appError(400,"暱稱至少 2 個字元以上", next));
    }
    password = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      email, 
      password,
      name
    });
    generateSendJWT(res, 201, newUser);
  },
  async signIn(req, res, next) {
    let { email, password } = req.body;
    if (!email || !password) {
      return next(appError(400, "Email 及 密碼為必填欄位", next))
    }
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return next(appError(400, "帳號或密碼錯誤，請重新輸入！", next));
    }
    const auth = await bcrypt.compare(password, user.password);
    if(!auth) {
      return next(appError(400, "您的密碼不正確", next));
    }
    generateSendJWT(res, 200, user);
  },
  async updatePassword(req, res, next) {
    let { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      return next(appError(400, "請填寫密碼及確認密碼", next))
    }
    if(!validator.isLength(password, { min: 8 }) || !validator.isAlphanumeric(password)){
      return next(appError(400, "密碼需至少 8 碼以上，並英數混合", next));
    }
    if(validator.isAlpha(password) || validator.isNumeric(password)){
      return next(appError(400, "密碼需英數混合", next));
    }
    if(!validator.equals(confirmPassword, password)){
      return next(appError(400, "密碼不一致！", next));
    }
    
    newPassword = await bcrypt.hash(password, 12);
    const user = await User.findByIdAndUpdate(req.user.id, {
      password: newPassword
    });
    generateSendJWT(res, 200, user);
  },
  async getProfile(req, res, next) {
    handleSuccess(res, req.user);
  },
  async updateProfile(req, res, next) {
    let { gender, photo, name } = req.body;
    if (!gender|| !name) {
      return next(appError(400, "請輸入必填欄位：性別、暱稱", next))
    }
    if(!validator.isLength(name, { min: 2 })){
      return next(appError(400,"暱稱至少 2 個字元以上", next));
    }
    if (gender !== 'male' && gender !== 'female') {
      return next(appError(400, "性別欄位需為 male 或 female", next))
    }
    const editContent = {
      gender,
      name,
      photo
    };
    const user = await User.findByIdAndUpdate(req.user.id, editContent,  {new: true});

    handleSuccess(res, user);
  }
}

module.exports = userController;