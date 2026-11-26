const express = require('express');
const router = express.Router();
const productsApi = require('../../controllers/api/productsApiController');

router.get('/', productsApi.list);
router.get('/:id', productsApi.detail);
router.post('/', productsApi.create);
router.put('/:id', productsApi.update);
router.delete('/:id', productsApi.remove);

module.exports = router;
