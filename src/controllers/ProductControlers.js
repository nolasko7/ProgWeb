const categories = require('../../public/data/categories');
const products = require('../models/products');
const {contadorCarrito} = require('../models/carrtio');

function obtenerProducto(req , res){

    const id = parseInt(req.params.id);
    const productoEncontrado = products.getProductoPorId(id);
    const productosRandom = products.productosRandom(id);
    const contador = contadorCarrito(req.session.carrito);
    
    
    const flash = req.session.flash;
    req.session.flash = null;



    if (productoEncontrado) {
        const productosRelacionados = products.productosRandomDelamismaCategoria(productoEncontrado.category, id);
        res.render("pages/product", {productoEncontrado, categories , productosRandom, productosRelacionados, flash ,contador });
    } else {
        res.status(404).render("pages/error", { code: 404, message: "Producto no encontrado", categories });
    }

}


module.exports = { obtenerProducto };