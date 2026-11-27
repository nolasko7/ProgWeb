const orderModel = require('../models/orderModel');

function getPedidosDelUsuario(userId) {
    return orderModel.getPedidosPorUsuario(userId);
}

module.exports = { getPedidosDelUsuario };
