const productsModel = require('../models/products');
const obtenerCategoriaName = require('../models/category');

function getRandomProducts(excludedId) {
    return productsModel.productosRandom(excludedId);
}

function getRelatedProducts(category, excludedId) {

    if(!Number.isFinite(Number(category))){
        return productsModel.productosRandomDelamismaCategoria(category, excludedId);
    }

    else{


   const categoriaRow = obtenerCategoriaName.obtenerCategoriaName(category);
   const nombreCategoria = categoriaRow?.name;
   return productsModel.productosRandomDelamismaCategoria(nombreCategoria, excludedId);
    
    }

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

function getProductosOrdenados(categoria , orden){
    return productsModel.ordenarProductos(categoria , orden);
}

function normalizeId(value) {
    if(value === undefined || value === null || value === ''){
       return null;
    }

    const id = Number(value);

    if(!Number.isInteger(id) || id <= 0) {
        return null;
    }

    return id;
}

module.exports = {
    getRandomProducts,
    getRelatedProducts,
    getMostRequestedProducts,
    getAllProducts,
    getProductById,
    getProductsByCategory,
    getProductosOrdenados,
    normalizeId
};
