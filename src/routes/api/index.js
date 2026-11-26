const express = require('express');
const cors = require('cors');
const { apiNotFound, apiServerError } = require('../../middlewares/apiErrorHandlers');

const router = express.Router();

// CORS: permite que clientes de otros dominios/puertos (ej: el dashboard en React) consuman la API
router.use(cors());
// Interpreta el body en formato JSON (POST / PUT)
router.use(express.json());

// Estado de la API
router.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'API de Mi Ecommerce' });
});

// Errores de la API: responden JSON en vez de renderizar vistas
router.use(apiNotFound);
router.use(apiServerError);

module.exports = router;
