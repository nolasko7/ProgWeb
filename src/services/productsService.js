const productsModel = require('../models/products');

function getRandomProducts(excludedId) {
    return productsModel.productosRandom(excludedId);
}

function getRelatedProducts(category, excludedId) {
    return productsModel.productosRandomDelamismaCategoria(category, excludedId);
}

function getMostRequestedProducts() {
    return productsModel.productosMasLlevados();
}

function getAllProducts() {
    return productsModel.getTodosProductos();
}

function getProductById(id) {
    return productsModel.getProductoPorId(id);
}

function getProductsByCategory(category) {
    return productsModel.getCategoriaProductos(category);
}

module.exports = {
    getRandomProducts,
    getRelatedProducts,
    getMostRequestedProducts,
    getAllProducts,
    getProductById,
    getProductsByCategory,
};
