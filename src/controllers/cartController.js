const productsService = require('../services/productsService');
const cartService = require('../services/cartService');
const { contadorCarrito } = require('../models/carrtio');
const { stockDown } = require('../models/products')

function addToCart(req, res) {
    const productId = productsService.normalizeId(req.body.productId);
    if(productId === null){
        return res.status(400).send('ID no valido');
    }
    const producto = productsService.getProductById(productId);

    if (!producto) {
        return res.status(404).send('Producto no encontrado');
    }

    const { message } = cartService.addProduct(req.session, productId, producto.name);
    req.session.flash = message;

    stockDown(productId);
    

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
    const productId = productsService.normalizeId(req.params.id);
    if (productId === null) {
        return res.status(400).send('ID no valido');
    }

    const producto = productsService.getProductById(productId);

    if(!producto) {
        return res.status(404).send('Producto no encontrado');
    }

    cartService.incrementQuantity(req.session, productId);
    res.redirect('/cart/list');
}

function decrementarCantidad(req, res) {
    const productId = productsService.normalizeId(req.params.id);
    if(productId === null) {
        return res.status(400).send('ID no valido');
    }

    const producto = productsService.getProductById(productId);

    if(!producto){ 
        return res.status(404).send('Producto no encontrado');
    }
    cartService.decrementQuantity(req.session, productId);
    res.redirect('/cart/list');
}

function quitarProducto(req, res) {
    const productId = productsService.normalizeId(req.params.id);
    if(productId === null) {
        return res.status(400).send('ID no valido');
    }

    const producto = productsService.getProductById(productId);

    if(!producto){ 
        return res.status(404).send('Producto no encontrado');
    }
    cartService.removeProduct(req.session, productId);
    res.redirect('/cart/list');
}






module.exports = { addToCart, cargarCarrito, incrementarCantidad, decrementarCantidad, quitarProducto };