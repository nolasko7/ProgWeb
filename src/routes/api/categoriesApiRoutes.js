const express = require('express');
const router = express.Router();
const categoriesApi = require('../../controllers/api/categoriesApiController');

router.get('/', categoriesApi.list);
router.get('/:id', categoriesApi.detail);
router.post('/', categoriesApi.create);
router.put('/:id', categoriesApi.update);
router.delete('/:id', categoriesApi.remove);

module.exports = router;
