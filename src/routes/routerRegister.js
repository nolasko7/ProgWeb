const express = require('express');
const router = express.Router();
const {metodoGet , metodoPost} = require('../controllers/register');

router.get('/' , metodoGet );

router.post('/' , metodoPost);

module.exports = router;



