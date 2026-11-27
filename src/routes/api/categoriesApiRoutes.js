const express = require('express');
const router = express.Router();
const categoriesApi = require('../../controllers/api/categoriesApiController');
const { verifyToken, requireAdmin } = require('../../middlewares/auth');

// Públicas
router.get('/', categoriesApi.list);
router.get('/:id', categoriesApi.detail);

// Solo administradores (token válido + rol admin)
router.post('/', verifyToken, requireAdmin, categoriesApi.create);
router.put('/:id', verifyToken, requireAdmin, categoriesApi.update);
router.delete('/:id', verifyToken, requireAdmin, categoriesApi.remove);

module.exports = router;
