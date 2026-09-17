const categories = require('../../public/data/categories');
const { contadorCarrito } = require('../models/carrtio');
const productsService = require('../services/productsService');

function normalizeId(value) {
    if (value === undefined || value === null || value === '') {
        return null;
    }

    const id = Number(value);

    if (!Number.isInteger(id) || id <= 0) {
        return null;
    }

    return id;
}

function obtenerProducto(req, res) {
    const id = normalizeId(req.params.id);

    if (id === null) {
        return res.status(400).render("pages/error", {
            titulo: "ID no válido",
            code: 400,
            message: "ID no numérico",
            categories
        });
    }

    const productoEncontrado = productsService.getProductById(id);
    const productosRandom = productsService.getRandomProducts(id);
    const contador = contadorCarrito(req.session.carrito);
    const flash = req.session.flash;
    req.session.flash = null;

    if (!productoEncontrado) {
        return res.status(404).render("pages/error", {
            titulo: "Producto no encontrado",
            code: 404,
            message: "Producto no encontrado",
            categories
        });
    }

    const productosRelacionados = productsService.getRelatedProducts(productoEncontrado.category, id);

    return res.render("pages/product", {
        titulo: `Producto - ${productoEncontrado.name}`,
        productoEncontrado,
        categories,
        productosRandom,
        productosRelacionados,
        flash,
        contador
    });
}

module.exports = { obtenerProducto };