const { getProductoPorId } = require('../models/products');

function addToCart(req, res) {

    const productId = Number(req.body.productId);
    const producto = getProductoPorId(productId);

    if (!producto) {
        return res.status(404).send('Producto no encontrado');
    }

    const item = req.session.carrito.find(i => i.productId === productId);

    if (item) {
        item.quantity++;
        req.session.flash = `${producto.name} ya estaba en el carrito, se sumó otra unidad`;
    } else {
        req.session.carrito.push({ productId, quantity: 1 });
        req.session.flash = `${producto.name} se agregó al carrito`;
    }

    // req.get('Referer') = la URL de la página desde donde vino el <form>

    res.redirect(req.get('Referer'));
}

function cargarCarrito(req, res) {
    const carrito = req.session.carrito || [];

    const elementosCarrito = carrito
        .map(item => {
            const objeto = getProductoPorId(item.productId);

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

    res.render('pages/cart', { elementosCarrito, totalCarrito });
}

function incrementarCantidad(req, res) {
    const productId = Number(req.params.id);
    const carrito = req.session.carrito || [];
    const item = carrito.find(producto => producto.productId === productId);

    if (item) {
        item.quantity += 1;
    }

    res.redirect('/cart/list');
}

function decrementarCantidad(req, res) {
    const productId = Number(req.params.id);
    const carrito = req.session.carrito || [];

    req.session.carrito = carrito
        .map(item => {
            if (item.productId === productId) {
                return {
                    ...item,
                    quantity: Math.max(0, Number(item.quantity) - 1)
                };
            }

            return item;
        })
        .filter(item => item.quantity > 0);

    res.redirect('/cart/list');
}

function quitarProducto(req, res) {
    const productId = Number(req.params.id);
    req.session.carrito = (req.session.carrito || []).filter(item => item.productId !== productId);

    res.redirect('/cart/list');
}

module.exports = { addToCart, cargarCarrito, incrementarCantidad, decrementarCantidad, quitarProducto };