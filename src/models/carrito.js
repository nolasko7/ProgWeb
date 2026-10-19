const {
    devolverStock,
    descontarStock,
    devolverStockCantidad
} = require('./products');

// Devuelve cuántos productos distintos hay en el carrito.
function contadorCarrito(carrito) {
    return carrito.length;
}

// Crea el carrito en la sesión la primera vez que se necesita.
function asegurarCarrito(session) {
    if (!session.carrito) {
        session.carrito = [];
    }

    return session.carrito;
}

// Agrega una unidad o incrementa la cantidad de un producto existente.
function agregarProducto(session, productId, productName) {
    const carrito = asegurarCarrito(session);
    const item = carrito.find(producto => producto.productId === productId);

    if (item) {
        item.quantity += 1;
        return {
            carrito,
            message: `${productName} ya estaba en el carrito, se sumó otra unidad`
        };
    }

    carrito.push({ productId, quantity: 1 });
    return {
        carrito,
        message: `${productName} se agregó al carrito`
    };
}

// Reserva stock antes de aumentar la cantidad.
function incrementarCantidad(session, productId) {
    const carrito = asegurarCarrito(session);
    const item = carrito.find(producto => producto.productId === productId);

    if (!item) return { carrito, actualizado: false };

    const resultadoStock = descontarStock(productId);
    if (resultadoStock.changes === 0) return { carrito, actualizado: false };

    item.quantity += 1;
    return { carrito, actualizado: true };
}

// Reduce una unidad y la devuelve al stock; elimina el producto cuando llega a cero.
function decrementarCantidad(session, productId) {
    const carrito = asegurarCarrito(session);
    const item = carrito.find(producto => producto.productId === productId);
    if (!item) return carrito;

    item.quantity = Math.max(0, Number(item.quantity) - 1);
    devolverStock(productId);
    session.carrito = carrito.filter(producto => producto.quantity > 0);

    return session.carrito;
}

// Elimina el producto completo y devuelve al inventario todas sus unidades.
function quitarProducto(session, productId) {
    const carrito = asegurarCarrito(session);
    const item = carrito.find(producto => producto.productId === productId);

    if (item) {
        devolverStockCantidad(item.productId, item.quantity);
    }

    session.carrito = carrito.filter(item => item.productId !== productId);
    return session.carrito;
}

// Vacía el carrito y devuelve al stock todas las unidades que contenía.
function vaciarCarrito(session) {
    const carrito = asegurarCarrito(session);
    carrito.forEach(item => devolverStockCantidad(item.productId, item.quantity));
    session.carrito = [];
    return session.carrito;
}

module.exports = {
    contadorCarrito,
    asegurarCarrito,
    agregarProducto,
    incrementarCantidad,
    decrementarCantidad,
    quitarProducto,
    obtenerCarrito: asegurarCarrito,
    vaciarCarrito
};
