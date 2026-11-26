const productModel = require('../models/productModel');
const categoryModel = require('../models/categoryModel');

// Resumen para las tarjetas de métricas del Dashboard
function getStats() {
    return {
        totalProducts: productModel.contarProductos(),
        totalCategories: categoryModel.contarCategorias()
    };
}

module.exports = { getStats };
