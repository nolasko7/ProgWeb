const { contadorCarrito } = require('../models/carrtio');



function categories(req, res) {

    const categoryName = req.params.categoryName;
    const contador = contadorCarrito(req.session.carrito);

    res.render('pages/category', {
        titulo: `Categoría - ${categoryName}`,
        categoryName,
        contador
    });
}








module.exports = { categories }
