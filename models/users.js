const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '請輸入您的名字']
    },
    email: {
      type: String,
      required: [true, '請輸入您的 Email'],
      unique: true,
      lowercase: true,
      select: false
    },
    photo: String,
    password: {
      type: String,
      required: [true, '請輸入您的密碼'],
      minLength: 8,
      select: false
    },
    gender: {
      type: String,
      enum: ['male', 'female']
    }
  }
  , { versionKey: false }
);
const User = mongoose.model(
  'User',
  usersSchema
);
usersSchema.plugin(uniqueValidator, { 
  message: '帳號已被註冊，請替換新的 {PATH}！'
});

module.exports = User;
