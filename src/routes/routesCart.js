const express = require('express');
const router = express.Router();
const { addToCart, cargarCarrito, incrementarCantidad, decrementarCantidad, quitarProducto } = require('../controllers/cartController');

router.post('/add', addToCart);
router.post('/increment/:id', incrementarCantidad);
router.post('/decrement/:id', decrementarCantidad);
router.post('/remove/:id', quitarProducto);
router.get('/list', cargarCarrito);

module.exports = router;