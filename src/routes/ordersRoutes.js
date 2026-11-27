const express = require('express');
const router = express.Router();
const { misPedidos } = require('../controllers/ordersController');

router.get('/', misPedidos);

module.exports = router;
