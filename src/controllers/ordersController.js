const orderService = require('../services/orderService');

// GET /orders  (Mis Pedidos)
function misPedidos(req, res) {
    const pedidos = orderService.getPedidosDelUsuario(req.session.user.id);
    res.render('pages/orders', { titulo: 'Mis pedidos', pedidos });
}

module.exports = { misPedidos };
