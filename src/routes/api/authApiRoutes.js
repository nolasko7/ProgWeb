const express = require('express');
const router = express.Router();
const authApi = require('../../controllers/api/authApiController');
const { verifyToken } = require('../../middlewares/auth');

router.post('/register', authApi.register);
router.post('/login', authApi.login);
router.get('/me', verifyToken, authApi.me);

module.exports = router;
