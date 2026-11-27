const express = require('express');
const router = express.Router();
const statsApi = require('../../controllers/api/statsApiController');
const { verifyToken, requireAdmin } = require('../../middlewares/auth');

// Pública: cantidad de productos y categorías
router.get('/', statsApi.summary);

// Solo administradores: métricas de ventas (datos sensibles del negocio)
router.get('/sales', verifyToken, requireAdmin, statsApi.sales);

module.exports = router;
