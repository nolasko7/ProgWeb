const { contadorCarrito } = require('../models/carrtio');
const productsService = require('../services/productsService');


function categories(req, res) {

    const categoryName = req.params.categoryName;
    const productos = productsService.getProductsByCategory(categoryName);
    const contador = contadorCarrito(req.session.carrito);

    res.render('pages/category', {
        titulo: `Categoría - ${categoryName}`,
        categoryName,
        productos,
        contador
    });
}








module.exports = { categories }
