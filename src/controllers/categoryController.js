const { contadorCarrito } = require('../models/cartModel');
const productsService = require('../services/productService');

function categories(req, res) {
    const categoryName = req.params.categoryName;
    const { sort } = req.query;

    const productos = productsService.getProductosOrdenados(categoryName,sort);
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
