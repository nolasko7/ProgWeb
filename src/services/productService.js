const productsModel = require('../models/productModel');
const obtenerCategoriaName = require('../models/categoryModel');

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

// ---------------------- ABM de productos (API) ----------------------

const CAMPOS_PRODUCTO = ['id_Category', 'name', 'price', 'images_main', 'images_2', 'images_3', 'images_4', 'description', 'stock', 'maspedido'];

// Se queda solo con los campos conocidos del body (ignora cualquier otro, por ejemplo "id")
function tomarCampos(body) {
    const datos = {};
    CAMPOS_PRODUCTO.forEach(campo => {
        if (body[campo] !== undefined) datos[campo] = body[campo];
    });
    return datos;
}

function textoNoVacio(valor) {
    return typeof valor === 'string' && valor.trim() !== '';
}

function validarProducto(producto) {
    const errores = [];

    if (!textoNoVacio(producto.name)) {
        errores.push('name es obligatorio');
    }
    if (typeof producto.price !== 'number' || !Number.isFinite(producto.price) || producto.price < 0) {
        errores.push('price tiene que ser un número mayor o igual a 0');
    }
    if (!Number.isInteger(producto.stock) || producto.stock < 0) {
        errores.push('stock tiene que ser un número entero mayor o igual a 0');
    }
    if (!Number.isInteger(producto.maspedido) || producto.maspedido < 0) {
        errores.push('maspedido tiene que ser un número entero mayor o igual a 0');
    }
    if (!textoNoVacio(producto.images_main)) {
        errores.push('images_main es obligatorio');
    }
    ['images_2', 'images_3', 'images_4', 'description'].forEach(campo => {
        if (producto[campo] !== null && typeof producto[campo] !== 'string') {
            errores.push(`${campo} tiene que ser un texto`);
        }
    });
    if (!Number.isInteger(producto.id_Category) || !obtenerCategoriaName.obtenerCategoriaName(producto.id_Category)) {
        errores.push('id_Category tiene que ser el id de una categoría existente');
    }

    return errores;
}

/**
 * Crea un producto. Devuelve { producto } o { errores }.
 */
function createProduct(body) {
    const producto = {
        images_2: null,
        images_3: null,
        images_4: null,
        description: null,
        stock: 0,
        maspedido: 0,
        ...tomarCampos(body)
    };

    const errores = validarProducto(producto);
    if (errores.length > 0) {
        return { errores };
    }

    return { producto: productsModel.crearProducto(producto) };
}

/**
 * Actualiza un producto (se pueden mandar solo los campos a cambiar).
 * Devuelve null si no existe, o { producto } / { errores }.
 */
function updateProduct(id, body) {
    const existente = productsModel.getProductoPorId(id);
    if (!existente) {
        return null;
    }

    const producto = { ...existente, ...tomarCampos(body) };

    const errores = validarProducto(producto);
    if (errores.length > 0) {
        return { errores };
    }

    return { producto: productsModel.actualizarProducto(id, producto) };
}

/**
 * Elimina un producto. Devuelve el producto eliminado o null si no existía.
 */
function deleteProduct(id) {
    const existente = productsModel.getProductoPorId(id);
    if (!existente) {
        return null;
    }

    productsModel.eliminarProducto(id);
    return existente;
}

module.exports = {
    getRandomProducts,
    getRelatedProducts,
    getMostRequestedProducts,
    getAllProducts,
    getProductById,
    getProductsByCategory,
    getProductosOrdenados,
    createProduct,
    updateProduct,
    deleteProduct
};
