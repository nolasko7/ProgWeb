const database = require("../db/connection");

function obtenerCategoriaName(id) {
    const categoria = database.prepare("SELECT name FROM categories WHERE id = ? ").get(id);
    return categoria;
}

function getCategorias() {
    const categorias = database.prepare("SELECT * FROM categories").all();
    return categorias;
}

// ---------------------- ABM (usado por la API) ----------------------

function getCategoriaPorId(id) {
    return database.prepare("SELECT * FROM categories WHERE id = ?").get(id);
}

function getCategoriaPorNombre(name) {
    return database.prepare("SELECT * FROM categories WHERE LOWER(name) = LOWER(?)").get(name);
}

function contarProductosDeCategoria(id) {
    return database.prepare("SELECT COUNT(*) AS total FROM products WHERE id_Category = ?").get(id).total;
}

function crearCategoria(categoria) {
    const resultado = database.prepare(
        "INSERT INTO categories (name, photo) VALUES (@name, @photo)"
    ).run(categoria);

    return getCategoriaPorId(resultado.lastInsertRowid);
}

function actualizarCategoria(id, categoria) {
    database.prepare(
        "UPDATE categories SET name = @name, photo = @photo WHERE id = @id"
    ).run({ ...categoria, id });

    return getCategoriaPorId(id);
}

function eliminarCategoria(id) {
    return database.prepare("DELETE FROM categories WHERE id = ?").run(id);
}

module.exports = {
    obtenerCategoriaName,
    getCategorias,
    getCategoriaPorId,
    getCategoriaPorNombre,
    contarProductosDeCategoria,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};
