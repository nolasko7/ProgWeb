const express = require('express');
const router = express.Router();
const { categories } = require('../controllers/categoryController');

router.get('/:categoryName', categories);

module.exports = router;