const express = require('express');
const router = express.Router();
const productsApi = require('../../controllers/api/productsApiController');
const { verifyToken, requireAdmin } = require('../../middlewares/auth');

// Públicas
router.get('/', productsApi.list);
router.get('/:id', productsApi.detail);

// Solo administradores (token válido + rol admin)
router.post('/', verifyToken, requireAdmin, productsApi.create);
router.put('/:id', verifyToken, requireAdmin, productsApi.update);
router.delete('/:id', verifyToken, requireAdmin, productsApi.remove);

module.exports = router;
