const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const handleErrorAsync = require('../service/handleErrorAsync');
const UserController = require('../controllers/users');
const { isAuth } = require('../middlewares/auth');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/sign_up', handleErrorAsync(UserController.signUp));
router.post('/sign_in', handleErrorAsync(UserController.signIn));
router.post('/updatePassword', isAuth, handleErrorAsync(UserController.updatePassword));
router.get('/profile', isAuth, handleErrorAsync(UserController.getProfile));
router.patch('/profile', isAuth, handleErrorAsync(UserController.updateProfile));
module.exports = router;
