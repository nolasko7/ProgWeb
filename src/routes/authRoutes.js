const express = require('express');
const router = express.Router();
const {metodoGet , metodoPost} = require('../controllers/authController');

router.get('/' , metodoGet );

router.post('/' , metodoPost);

module.exports = router;



