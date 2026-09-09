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

    const elementosCarrito = carrito.map(objeto=>({

        ...objeto,

        objeto : getProductoPorId(objeto.productId)


    }));

    res.render('pages/cart', { elementosCarrito });
}

module.exports = { addToCart, cargarCarrito };