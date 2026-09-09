const express = require('express');
const router = express.Router();
const { categories } = require('../controllers/CastegoryControlers');
module.exports = router;


router.get('/:categoryName', categories );
