const express = require('express');
const products = require('../../public/data/products');
const router = express.Router();
const categories = require('../../public/data/categories');

module.exports = router;


router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const productoEncontrado = products.find(p => p.id === id);
    if (productoEncontrado) {
        res.render("pages/product", { product: productoEncontrado, categories });
    } else {
        res.status(404).render("pages/error", { code: 404, message: "Producto no encontrado", categories });
    }
})  