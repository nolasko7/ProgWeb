const express = require('express');
const router = express.Router();
const { obtenerProducto } = require('../controllers/ProductControlers');
module.exports = router;



router.get('/:id', obtenerProducto);


