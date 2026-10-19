const productsService = require('../services/productsService');
const cartService = require('../services/cartService');
const servicioEventos = require('../services/eventService');
const { contadorCarrito } = require('../services/cartService');
const { descontarStock } = require('../models/products')

// Guarda la sesión y luego notifica por WebSocket a las pestañas de esa sesión.
function guardarYNotificar(req, res, redirigirA, idsProductos = []) {
    req.session.save((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('No se pudo guardar el carrito');
        }
        // Busca el stock después de guardar y entrega todos los avisos al servicio de eventos.
        const productosStock = [...new Set(idsProductos)]
            .map(id => productsService.getProductById(id))
            .filter(Boolean)
            .map(producto => ({ id: producto.id, stock: producto.stock }));

        servicioEventos.emitirActualizacionCarrito(
            req.sessionID,
            contadorCarrito(req.session.carrito),
            productosStock
        );
        res.redirect(redirigirA);
    });
}

function agregarAlCarrito(req, res) {
    const productId = Number(req.body.productId);
    const producto = productsService.getProductById(productId);

    if (!producto) {
        return res.status(404).send('Producto no encontrado');
    }

    // Reserva primero una unidad; así el stock no puede quedar en negativo.
    const resultadoStock = descontarStock(productId);
    if (resultadoStock.changes === 0) {
        return res.status(409).send('No queda stock disponible');
    }

    const { message } = cartService.agregarProducto(req.session, productId, producto.name);
    req.session.flash = message;

    guardarYNotificar(req, res, req.get('Referer')|| '/', [productId]);
}

function cargarCarrito(req, res) {
    const carrito = cartService.obtenerCarrito(req.session);

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

function aumentarCantidad(req, res) {
    const productId = Number(req.params.id);
    const resultado = cartService.incrementarCantidad(req.session, productId);
    if (!resultado.actualizado) {
        return res.status(409).send('No hay más unidades disponibles');
    }
    guardarYNotificar(req, res, '/cart/list', [productId]);
}

function reducirCantidad(req, res) {
    const productId = Number(req.params.id);
    cartService.decrementarCantidad(req.session, productId);
    guardarYNotificar(req, res, '/cart/list', [productId]);
}

function eliminarProducto(req, res) {
    const productId = Number(req.params.id);
    cartService.quitarProducto(req.session, productId);
    guardarYNotificar(req, res, '/cart/list', [productId]);
}

function vaciarElCarrito(req, res) {
    const idsProductos = req.session.carrito.map(item => item.productId);
    cartService.vaciarCarrito(req.session);
    guardarYNotificar(req, res, '/cart/list', idsProductos);
}

module.exports = { agregarAlCarrito, cargarCarrito, aumentarCantidad, reducirCantidad, eliminarProducto, vaciarElCarrito };
