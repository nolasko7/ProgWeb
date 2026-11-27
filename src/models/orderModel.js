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

// ---------------------- Métricas de ventas (dashboard) ----------------------

// Totales generales: cantidad de pedidos, plata vendida, ticket promedio y unidades
function getResumenVentas() {
    const pedidos = db.prepare(`
        SELECT COUNT(*) AS totalPedidos,
               COALESCE(SUM(total), 0) AS totalVendido,
               COALESCE(AVG(total), 0) AS ticketPromedio
        FROM orders
    `).get();

    const unidades = db.prepare('SELECT COALESCE(SUM(quantity), 0) AS unidadesVendidas FROM order_items').get();

    return { ...pedidos, ticketPromedio: Math.round(pedidos.ticketPromedio), ...unidades };
}

// Productos más vendidos (por unidades) con lo que facturó cada uno
function getProductosMasVendidos(limite) {
    return db.prepare(`
        SELECT p.id, p.name, p.images_main,
               SUM(oi.quantity) AS unidades,
               SUM(oi.quantity * oi.unit_price) AS ingresos
        FROM order_items oi
        INNER JOIN products p ON p.id = oi.product_id
        GROUP BY p.id
        ORDER BY unidades DESC, ingresos DESC
        LIMIT ?
    `).all(limite);
}

// Ventas agrupadas por categoría
function getVentasPorCategoria() {
    return db.prepare(`
        SELECT c.id, c.name,
               SUM(oi.quantity) AS unidades,
               SUM(oi.quantity * oi.unit_price) AS ingresos
        FROM order_items oi
        INNER JOIN products p ON p.id = oi.product_id
        INNER JOIN categories c ON c.id = p.id_Category
        GROUP BY c.id
        ORDER BY ingresos DESC
    `).all();
}

// Cantidad de pedidos en cada estado (pendiente, enviado, entregado...)
function getPedidosPorEstado() {
    return db.prepare(`
        SELECT status, COUNT(*) AS cantidad
        FROM orders
        GROUP BY status
        ORDER BY cantidad DESC
    `).all();
}

// Últimos pedidos con el nombre del cliente
function getUltimosPedidos(limite) {
    return db.prepare(`
        SELECT o.id, o.total, o.status, o.created_at, u.name AS cliente,
               SUM(oi.quantity) AS unidades
        FROM orders o
        INNER JOIN users u ON u.id = o.user_id
        LEFT JOIN order_items oi ON oi.order_id = o.id
        GROUP BY o.id
        ORDER BY o.created_at DESC
        LIMIT ?
    `).all(limite);
}

module.exports = {
    getPedidosPorUsuario,
    getResumenVentas,
    getProductosMasVendidos,
    getVentasPorCategoria,
    getPedidosPorEstado,
    getUltimosPedidos
};
