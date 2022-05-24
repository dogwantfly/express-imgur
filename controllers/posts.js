const AppError = require('../service/appError');
const handleSuccess = require('../service/sucessHandler');
const Post = require('../models/posts');

const postController = {
  async getPosts(req, res, next) {
    const timeSort = req.query.timeSort === 'asc' ? 'createdAt' : '-createdAt';
    const q = req.query.q ? { "content": new RegExp(req.query.q)} : {};
    const post = await Post.find(q).populate({
      path: 'user',
      select: 'name photo'
    }).sort(timeSort);
    handleSuccess(res, post);
  },
  async postPost(req, res, next) {
    const data = req.body;
    if (data.content && data.user) {
      const newPost = await Post.create(
        {
          user: req.user._id,
          content: data.content,
          tags: data.tags,
          type: data.type,
          image: data.image,
          likes: data.likes,
        }
      );
      handleSuccess(res, newPost);
    } else {
      return next(AppError(400, "欄位未填寫正確：貼文內容為必填，至少需加入一個 tag，需設定貼文類別", next));
    }
  },
  async deletePosts(req, res, next) {
    console.log('req.originalUrl:', req.originalUrl);
    if (req.originalUrl === '/posts/') {
      return next(AppError(400, "刪除單筆資料請輸入 id", next));
    }
    const post = await Post.deleteMany({});
    handleSuccess(res, post);
  },
  async deletePost(req, res, next) {
    const id = req.params.id;
    const result = await Post.findByIdAndDelete(id);
    if (result) {
      handleSuccess(res, result);
    } else {
      return next(AppError(400, "id 不存在", next));
    }
  },
  async updatePost(req, res, next) {
    const data = req.body;
    const id = req.params.id;
    if(data.content){
      const editContent = {
        content: data.content,
        likes: data.likes
      };
      const editPost = await Post.findByIdAndUpdate(id, editContent,  {new: true});
      if (editPost) {
        handleSuccess(res, editPost);
      } else {
        return next(AppError(400, "欄位未填寫正確或無此 id", next));
      }
      
    } else {
      return next(AppError(400, "欄位未填寫正確：貼文內容為必填", next));
    }
  }
}

module.exports = postController;