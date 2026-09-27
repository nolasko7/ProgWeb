const productsService = require('../services/productsService');
const cartService = require('../services/cartService');
const { contadorCarrito } = require('../models/carrtio');
const { stockDown } = require('../models/products');
const { broadcast } = require('../websocket');

// Arma y envía el estado completo del carrito por WS
function broadcastCart(session) {
    const carrito = cartService.getCart(session);
    const items = carrito.map(item => {
        const obj = productsService.getProductById(item.productId);
        if (!obj) return null;
        return {
            id: obj.id,
            name: obj.name,
            image: obj.images_main || obj.image || '/images/images.jpg',
            stock: obj.stock,
            cantidad: item.quantity,
            precio: obj.price,
            subtotal: item.quantity * obj.price
        };
    }).filter(Boolean);
    const total = items.reduce((s, i) => s + i.subtotal, 0);

    broadcast({ type: 'cart-update', count: contadorCarrito(session.carrito) });
    broadcast({ type: 'cart-sync', items, total });
}

function addToCart(req, res) {
    const productId = Number(req.body.productId);
    const producto = productsService.getProductById(productId);

    if (!producto) {
        return res.status(404).send('Producto no encontrado');
    }

    const { message } = cartService.addProduct(req.session, productId, producto.name);
    req.session.flash = message;

    stockDown(productId);

    broadcastCart(req.session);

    res.redirect(req.get('Referer'));
}

function cargarCarrito(req, res) {
    const carrito = cartService.getCart(req.session);

    const elementosCarrito = carrito
        .map(item => {
            const objeto = productsService.getProductById(item.productId);

            if (!objeto) {
                return null;
            }

            return {
                cantidad: Number(item.quantity || 0),
                objeto,
                total: Number(item.quantity || 0) * Number(objeto.price)
            };
        })
        .filter(Boolean);

    const totalCarrito = elementosCarrito.reduce((sum, item) => sum + item.total, 0);
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
    broadcastCart(req.session);
    res.redirect('/cart/list');
}

function decrementarCantidad(req, res) {
    const productId = Number(req.params.id);
    cartService.decrementQuantity(req.session, productId);
    broadcastCart(req.session);
    res.redirect('/cart/list');
}

function quitarProducto(req, res) {
    const productId = Number(req.params.id);
    cartService.removeProduct(req.session, productId);
    broadcastCart(req.session);
    res.redirect('/cart/list');
}

module.exports = { addToCart, cargarCarrito, incrementarCantidad, decrementarCantidad, quitarProducto };