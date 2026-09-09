const categories = require('../../public/data/categories');
const products = require('../models/products');



function obtenerProducto(req , res){

    const id = parseInt(req.params.id);
    const productoEncontrado = products.getProductoPorId(id);
    const productosRandom = products.productosRandom(id);
    
    
    const flash = req.session.flash;
    req.session.flash = null;



    if (productoEncontrado) {
        res.render("pages/product", {productoEncontrado, categories , productosRandom, flash});
    } else {
        res.status(404).render("pages/error", { code: 404, message: "Producto no encontrado", categories });
    }

}


module.exports = { obtenerProducto };