const express = require('express');
const router = express.Router();

const productService = require('../services/productService');
const { getCategorias } = require('../models/categoryModel');
const { contadorCarrito } = require('../models/cartModel');

const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const cartRoutes = require('./cartRoutes');
const searchRoutes = require('./searchRoutes');
const authRoutes = require('./authRoutes');

router.get("/", (req, res) => {
    const productos = productService.getRandomProducts();
    const flash = req.session.flash;
    req.session.flash = null;
    const productosMasLlevados = productService.getMostRequestedProducts();
    const contador = contadorCarrito(req.session.carrito);
    res.render("pages/index", {
        titulo: "Inicio",
        categories: getCategorias(),
        productos,
        productosMasLlevados,
        flash,
        contador
    });
});

router.use("/search", searchRoutes);
router.use("/product", productRoutes);
router.use("/cart", cartRoutes);
router.use("/category", categoryRoutes);
router.use("/register", authRoutes);

router.get("/login", (req, res) => {
    res.render("pages/login", { titulo: "Login" });
});

router.get("/checkout", (req, res, next) => {
    try {
        res.render("pages/checkout", { titulo: "Checkout" });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
