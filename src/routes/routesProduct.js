const express = require('express');
const products = require('../models/products');
const router = express.Router();
const categories = require('../../public/data/categories');

module.exports = router;


router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const productoEncontrado = products.getProductoPorId(id);
    const productosRandom = products.productosRandom(id);
    if (productoEncontrado) {
        res.render("pages/product", {productoEncontrado, categories , productosRandom});
    } else {
        res.status(404).render("pages/error", { code: 404, message: "Producto no encontrado", categories });
    }
})  