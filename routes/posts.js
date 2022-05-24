const express = require('express');
const router = express.Router();

const handleErrorAsync = require('../service/handleErrorAsync');
const PostController = require('../controllers/posts');
const { isAuth } = require('../middlewares/auth');
router.get('/', isAuth, handleErrorAsync(PostController.getPosts))
router.post('/', isAuth, handleErrorAsync(PostController.postPost))
router.delete('/', isAuth, handleErrorAsync(PostController.deletePosts))
router.delete('/:id', isAuth, handleErrorAsync(PostController.deletePost))
router.patch('/:id', isAuth, handleErrorAsync(PostController.updatePost));

  module.exports = router;
