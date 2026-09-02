const express = require('express');
const products = require('../../public/data/products');
const router = express.Router();
const categories = require('../../public/data/categories');

module.exports = router;


router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    res.render("pages/product", { product: products.find(p => p.id === id), categories });
})  