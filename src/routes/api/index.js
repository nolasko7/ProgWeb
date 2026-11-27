const express = require('express');
const cors = require('cors');
const { apiNotFound, apiServerError } = require('../../middlewares/apiErrorHandlers');
const productsApiRoutes = require('./productsApiRoutes');
const categoriesApiRoutes = require('./categoriesApiRoutes');
const statsApiRoutes = require('./statsApiRoutes');
const authApiRoutes = require('./authApiRoutes');

const router = express.Router();

// CORS: permite que clientes de otros dominios/puertos (ej: el dashboard en React) consuman la API
router.use(cors());
// Interpreta el body en formato JSON (POST / PUT)
router.use(express.json());

// Estado de la API
router.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'API de Mi Ecommerce' });
});

router.use('/products', productsApiRoutes);
router.use('/categories', categoriesApiRoutes);
router.use('/stats', statsApiRoutes);
router.use('/auth', authApiRoutes);

// Errores de la API: responden JSON en vez de renderizar vistas
router.use(apiNotFound);
router.use(apiServerError);

module.exports = router;
