const cartService = require('../services/cartService');
const { contadorCarrito } = require('../models/carrtio');
const { stockDown } = require('../models/products');

function addToCart(req, res) {
    const productId = Number(req.body.productId);
    const resultado = cartService.addProduct(req.session, productId);

    if (!resultado.success) {
        return res.status(404).send('Producto no encontrado');
    }

    req.session.flash = resultado.message;
    stockDown(productId);

    res.redirect(req.get('Referer') || '/');
}

function cargarCarrito(req, res) {
    const { elementosCarrito, totalCarrito } = cartService.getCartDetails(req.session);
    const contador = contadorCarrito(req.session.carrito);

    res.render('pages/cart', {
        titulo: 'Carrito',
        elementosCarrito,
        totalCarrito,
        contador
    });
}

function incrementarCantidad(req, res) {
    const productId = Number(req.params.id);
    cartService.incrementQuantity(req.session, productId);
    res.redirect('/cart/list');
}

function decrementarCantidad(req, res) {
    const productId = Number(req.params.id);
    cartService.decrementQuantity(req.session, productId);
    res.redirect('/cart/list');
}

function quitarProducto(req, res) {
    const productId = Number(req.params.id);
    cartService.removeProduct(req.session, productId);
    res.redirect('/cart/list');
}

module.exports = { addToCart, cargarCarrito, incrementarCantidad, decrementarCantidad, quitarProducto };