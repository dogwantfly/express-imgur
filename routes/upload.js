const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload');
const handleErrorAsync = require('../service/handleErrorAsync');
const { isAuth } = require('../middlewares/auth');
const upload = require('../service/image');

router.post('/', isAuth, upload, handleErrorAsync(uploadController.uploadImage));



module.exports = router;
