const express = require('express');
const router = express.Router();
const { obtenerProducto } = require('../controllers/productController');
module.exports = router;



router.get('/:id', obtenerProducto);


