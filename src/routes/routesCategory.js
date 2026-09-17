const express = require('express');
const router = express.Router();
const { categories , busqueda } = require('../controllers/CastegoryControlers');
module.exports = router;


router.get('/:categoryName', categories );

router.get('/busqueda', busqueda);