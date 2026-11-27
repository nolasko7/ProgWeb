const db = require("../db/connection");

// Pedidos de un usuario con la cantidad de productos de cada uno
function getPedidosPorUsuario(userId) {
    return db.prepare(`
        SELECT o.id, o.total, o.status, o.created_at,
               COALESCE(SUM(oi.quantity), 0) AS cantidad_productos
        FROM orders o
        LEFT JOIN order_items oi ON oi.order_id = o.id
        WHERE o.user_id = ?
        GROUP BY o.id
        ORDER BY o.created_at DESC
    `).all(userId);
}

module.exports = { getPedidosPorUsuario };
