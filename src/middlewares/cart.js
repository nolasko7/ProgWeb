const { contadorCarrito } = require('../models/cartModel');

// Inicializa el carrito en la sesion y deja el contador disponible en todas las vistas
function initCart(req, res, next) {
    if (!req.session) {
        return next();
    }
    if (!req.session.carrito) {
        /** @type {objetocarrito[]} */
        req.session.carrito = [];
    }
    res.locals.contador = contadorCarrito(req.session.carrito);
    next();
}

module.exports = { initCart };
