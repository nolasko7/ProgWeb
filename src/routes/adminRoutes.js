const express = require('express');
const router = express.Router();
const { panel } = require('../controllers/adminController');

router.get('/', panel);

module.exports = router;
