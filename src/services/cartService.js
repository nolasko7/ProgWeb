const carritoModelo = require('../models/carrito');

// El servicio solo conecta el controlador con las operaciones del modelo.
function asegurarCarrito(session) {
    return carritoModelo.asegurarCarrito(session);
}

function contadorCarrito(carrito) {
    return carritoModelo.contadorCarrito(carrito);
}

function agregarProducto(session, productId, productName) {
    return carritoModelo.agregarProducto(session, productId, productName);
}

function incrementarCantidad(session, productId) {
    return carritoModelo.incrementarCantidad(session, productId);
}

function decrementarCantidad(session, productId) {
    return carritoModelo.decrementarCantidad(session, productId);
}

function quitarProducto(session, productId) {
    return carritoModelo.quitarProducto(session, productId);
}

function obtenerCarrito(session) {
    return carritoModelo.obtenerCarrito(session);
}

function vaciarCarrito(session) {
    return carritoModelo.vaciarCarrito(session);
}

module.exports = {
    asegurarCarrito,
    contadorCarrito,
    agregarProducto,
    incrementarCantidad,
    decrementarCantidad,
    quitarProducto,
    obtenerCarrito,
    vaciarCarrito
};
