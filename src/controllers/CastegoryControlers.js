const { contadorCarrito } = require('../models/carrtio');
const productsService = require('../services/productsService');

function categories(req, res) {
    const categoryName = req.params.categoryName;
    const { sort } = req.query;

    let productos = productsService.getProductsByCategory(categoryName);

    if (sort === 'asc') {
        productos = [...productos].sort((a, b) => a.price - b.price);
    } else if (sort === 'desc') {
        productos = [...productos].sort((a, b) => b.price - a.price);
    }

    const contador = contadorCarrito(req.session.carrito);

    res.render('pages/category', {
        titulo: `Categoría - ${categoryName}`,
        categoryName,
        productos,
        contador,
        sort: sort || 'default'
    });
}



module.exports = { categories }
