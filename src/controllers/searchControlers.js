const { contadorCarrito } = require('../models/carrtio');
const productsService = require('../services/productsService');

function searchControl(req, res) {
    const busqueda = String(req.query.query).trim();
    const normalizar = (texto) => (texto || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const productosTotales = productsService.getAllProducts();
    const productos = busqueda
        ? productosTotales.filter((producto) => {
            const nombre = producto.name;
            return normalizar(nombre).includes(normalizar(busqueda));
        })
        : [];

    const contador = contadorCarrito(req.session && req.session.carrito ? req.session.carrito : []);

    res.render('pages/search', {
        busqueda,
        contador,
        productos,
        titulo: busqueda ? `Busqueda - ${busqueda}` : 'Busqueda'
    });
}

module.exports = { searchControl };