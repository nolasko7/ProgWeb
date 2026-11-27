const express = require('express');
const router = express.Router();
const authApi = require('../../controllers/api/authApiController');

router.post('/register', authApi.register);
router.post('/login', authApi.login);

module.exports = router;
