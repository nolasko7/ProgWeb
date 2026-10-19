const express = require('express');
const router = express.Router();
const { categories } = require('../controllers/CastegoryControlers');

router.get('/:categoryName', categories);

module.exports = router;