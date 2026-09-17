const categories = require('../../public/data/categories');
const { contadorCarrito } = require('../models/carrtio');
const productsService = require('../services/productsService');

function obtenerProducto(req , res){

    const id = parseInt(req.params.id);
    const productoEncontrado = productsService.getProductById(id);
    const productosRandom = productsService.getRandomProducts(id);
    const contador = contadorCarrito(req.session.carrito);
    
    
    const flash = req.session.flash;
    req.session.flash = null;



    if (productoEncontrado) {
        const productosRelacionados = productsService.getRelatedProducts(productoEncontrado.category, id);
        res.render("pages/product", {
            titulo: `Producto - ${productoEncontrado.name}`,
            productoEncontrado,
            categories,
            productosRandom,
            productosRelacionados,
            flash,
            contador
        });
    } else {
        res.status(404).render("pages/error", {
            titulo: "Producto no encontrado",
            code: 404,
            message: "Producto no encontrado",
            categories
        });
    }

}


module.exports = { obtenerProducto };