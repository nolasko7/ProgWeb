const express = require('express');
const router = express.Router();
const authApi = require('../../controllers/api/authApiController');

router.post('/register', authApi.register);

module.exports = router;
