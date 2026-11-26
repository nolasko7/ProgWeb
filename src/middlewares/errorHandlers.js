const { contadorCarrito } = require('../models/cartModel');
const { getCategorias } = require('../models/categoryModel');

function notFound(req, res) {
    const contador = contadorCarrito(req.session.carrito);
    res.status(404).render('pages/error', {
        code: 404,
        message: 'Página no encontrada',
        categories: getCategorias(),
        contador
    });
}

// eslint-disable-next-line no-unused-vars
function serverError(err, req, res, next) {
    console.error(err);
    res.status(500).render('pages/500');
}

module.exports = { notFound, serverError };
