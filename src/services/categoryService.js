const categoryModel = require('../models/categoryModel');

function textoNoVacio(valor) {
    return typeof valor === 'string' && valor.trim() !== '';
}

// Valida los datos de una categoría. idActual se usa al editar para no chocar con su propio nombre.
function validarCategoria(categoria, idActual) {
    const errores = [];

    if (!textoNoVacio(categoria.name)) {
        errores.push('name es obligatorio');
    } else {
        const repetida = categoryModel.getCategoriaPorNombre(categoria.name.trim());
        if (repetida && repetida.id !== idActual) {
            errores.push(`Ya existe una categoría llamada "${repetida.name}"`);
        }
    }
    if (!textoNoVacio(categoria.photo)) {
        errores.push('photo es obligatorio');
    }

    return errores;
}

function getAllCategories() {
    return categoryModel.getCategorias();
}

function getCategoryById(id) {
    return categoryModel.getCategoriaPorId(id);
}

/**
 * Crea una categoría. Devuelve { categoria } o { errores }.
 */
function createCategory(body) {
    const categoria = { name: body.name, photo: body.photo };

    const errores = validarCategoria(categoria);
    if (errores.length > 0) {
        return { errores };
    }

    return { categoria: categoryModel.crearCategoria({ name: categoria.name.trim(), photo: categoria.photo.trim() }) };
}

/**
 * Actualiza una categoría (se pueden mandar solo los campos a cambiar).
 * Devuelve null si no existe, o { categoria } / { errores }.
 */
function updateCategory(id, body) {
    const existente = categoryModel.getCategoriaPorId(id);
    if (!existente) {
        return null;
    }

    const categoria = {
        name: body.name !== undefined ? body.name : existente.name,
        photo: body.photo !== undefined ? body.photo : existente.photo
    };

    const errores = validarCategoria(categoria, id);
    if (errores.length > 0) {
        return { errores };
    }

    return { categoria: categoryModel.actualizarCategoria(id, { name: categoria.name.trim(), photo: categoria.photo.trim() }) };
}

/**
 * Elimina una categoría. Devuelve:
 *  - null si no existe
 *  - { conflicto } si todavía tiene productos (no se puede borrar)
 *  - { categoria } con la categoría eliminada
 */
function deleteCategory(id) {
    const existente = categoryModel.getCategoriaPorId(id);
    if (!existente) {
        return null;
    }

    const cantidadProductos = categoryModel.contarProductosDeCategoria(id);
    if (cantidadProductos > 0) {
        return { conflicto: `La categoría tiene ${cantidadProductos} producto(s) asociados. Eliminalos o cambialos de categoría primero.` };
    }

    categoryModel.eliminarCategoria(id);
    return { categoria: existente };
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
