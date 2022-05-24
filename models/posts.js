const mongoose = require('mongoose');
const tagsValidater = [v => Array.isArray(v) && v.length > 0, '貼文標籤 tags 未填寫，需至少新增一個 tag']
const postsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, '使用者 ID 未填寫']
  },
  tags: {
    type: [{
      type:String,
      required: [true, '貼文標籤 tags 未填寫']
    }],
    validate: tagsValidater, 
  },
  type: {
    type: String,
    enum:['group','person'],
    required: [true, '貼文類型 type 未填寫']
  },
  image: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    required: [true, 'Content 未填寫'],
  },
  likes: {
    type: Number,
    default: 0
  },
  comments:{
    type: Number,
    default: 0
  },
}, { versionKey: false });

const Post = mongoose.model(
  'Post',
  postsSchema
);

module.exports = Post;
