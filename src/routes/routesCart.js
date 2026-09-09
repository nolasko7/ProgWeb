const express = require('express');
const router = express.Router();
const { addToCart, cargarCarrito } = require('../controllers/cartController');

router.post('/add', addToCart);

router.get('/list', cargarCarrito);

module.exports = router;