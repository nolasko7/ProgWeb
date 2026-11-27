const productModel = require('../models/productModel');
const categoryModel = require('../models/categoryModel');
const orderModel = require('../models/orderModel');

// Resumen para las tarjetas de métricas del Dashboard
function getStats() {
    return {
        totalProducts: productModel.contarProductos(),
        totalCategories: categoryModel.contarCategorias()
    };
}

// Métricas de ventas para el dashboard de administración
function getSalesStats() {
    return {
        resumen: orderModel.getResumenVentas(),
        masVendidos: orderModel.getProductosMasVendidos(5),
        menosStock: productModel.getProductosConMenosStock(5),
        ventasPorCategoria: orderModel.getVentasPorCategoria(),
        pedidosPorEstado: orderModel.getPedidosPorEstado(),
        ultimosPedidos: orderModel.getUltimosPedidos(5)
    };
}

module.exports = { getStats, getSalesStats };
