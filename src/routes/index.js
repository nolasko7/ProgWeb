const express = require('express');
const router = express.Router();

const productService = require('../services/productService');
const { getCategorias } = require('../models/categoryModel');
const { contadorCarrito } = require('../models/cartModel');
const { requireLogin, requireAdminSession } = require('../middlewares/sessionAuth');

const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const cartRoutes = require('./cartRoutes');
const searchRoutes = require('./searchRoutes');
const authRoutes = require('./authRoutes');
const ordersRoutes = require('./ordersRoutes');
const adminRoutes = require('./adminRoutes');

// ------------------------- Públicas -------------------------

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
router.use("/category", categoryRoutes);

// Login, registro y logout (ver authRoutes)
router.use("/", authRoutes);

// ------------------- Usuarios autenticados -------------------

router.use("/cart", requireLogin, cartRoutes);
router.use("/orders", requireLogin, ordersRoutes);

router.get("/checkout", requireLogin, (req, res, next) => {
    try {
        res.render("pages/checkout", { titulo: "Checkout" });
    } catch (err) {
        next(err);
    }
});

// ---------------------- Administradores ----------------------

router.use("/admin", requireAdminSession, adminRoutes);

module.exports = router;
