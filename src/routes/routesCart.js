const express = require('express');
const router = express.Router();
const { agregarAlCarrito, cargarCarrito, aumentarCantidad, reducirCantidad, eliminarProducto, vaciarElCarrito } = require('../controllers/cartController');

router.post('/add', agregarAlCarrito);
router.post('/increment/:id', aumentarCantidad);
router.post('/decrement/:id', reducirCantidad);
router.post('/remove/:id', eliminarProducto);
router.post('/clear', vaciarElCarrito);
router.get('/list', cargarCarrito);

module.exports = router;
