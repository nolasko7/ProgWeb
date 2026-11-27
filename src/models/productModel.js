
    const database = require("../db/connection");


function productosRandom(id){
    
    const productosDisponibles = database.prepare("SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON c.id = p.id_Category").all(); // hago esto ya que no tengo una llamada que me productos ramdom 
    
        const filtrados = id === undefined
        ? productosDisponibles
        : productosDisponibles.filter(product => product.id !== parseInt(id));

    return [...filtrados]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
}

function productosRandomDelamismaCategoria(categoria, id){
    if(!categoria){
        return [];
    }

    const nombreCategoria = categoria;

    const productosFiltrados = id 
    ? database.prepare(`
        SELECT
            p.id,
            p.id_Category,
            p.name,
            p.price,
            p.images_main,
            p.images_2,
            p.images_3,
            p.images_4,
            p.description,
            p.stock,
            p.maspedido,
            c.id AS category_id,
            c.name AS category_name,
            c.photo AS category_photo
        FROM products p
        INNER JOIN categories c ON p.id_Category = c.id
        WHERE LOWER(c.name) = LOWER(?) AND p.id != ?
    `).all(nombreCategoria , parseInt(id))

    :database.prepare(`
        SELECT
            p.id,
            p.id_Category,
            p.name,
            p.price,
            p.images_main,
            p.images_2,
            p.images_3,
            p.images_4,
            p.description,
            p.stock,
            p.maspedido,
            c.id AS category_id,
            c.name AS category_name,
            c.photo AS category_photo
        FROM products p
        INNER JOIN categories c ON p.id_Category = c.id
        WHERE LOWER(c.name) = LOWER(?)
    `).all(nombreCategoria);


    return [...productosFiltrados]
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
}


function ordenarProductos(categoria, orden) {
    const direccion = orden?.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const productos = database.prepare(`
        SELECT
            p.id,
            p.id_Category,
            p.name,
            p.price,
            p.images_main,
            p.images_2,
            p.images_3,
            p.images_4,
            p.description,
            p.stock,
            p.maspedido,
            c.id AS category_id,
            c.name AS category_name,
            c.photo AS category_photo
        FROM products p
        INNER JOIN categories c ON p.id_Category = c.id
        WHERE LOWER(c.name) = LOWER(?)
        ORDER BY p.price ${direccion}
    `).all(categoria);

    return productos;
}



function productosMasLlevados(){
    return database.prepare("SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON c.id = p.id_Category ORDER BY p.maspedido DESC LIMIT 5").all();
}


function getTodosProductos(){
    // trae también el nombre de la categoría (category_name) para mostrarlo en las tarjetas y en la API
    return database.prepare("SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON c.id = p.id_Category").all();
}

function getProductoPorId(id){
    return database.prepare("SELECT * FROM products WHERE id = ?").get(id);
}

function getCategoriaProductos(categoria){

    if(typeof categoria !== "string" || categoria.trim() ===""){
        throw new Error("La categoria tiene que ser un texto no vacio ")
    }

    const nombreCategoria = categoria.trim();

    const productosFiltrados = database.prepare(`
        SELECT
            p.id,
            p.id_Category,
            p.name,
            p.price,
            p.images_main,
            p.images_2,
            p.images_3,
            p.images_4,
            p.description,
            p.stock,
            p.maspedido,
            c.id AS category_id,
            c.name AS category_name,
            c.photo AS category_photo
        FROM products p
        INNER JOIN categories c ON p.id_Category = c.id
        WHERE LOWER(c.name) = LOWER(?)
    `).all(nombreCategoria);

    return productosFiltrados
}

function stockDown(id) {
  return database.prepare(
    "UPDATE products SET stock = stock - 1 WHERE id = ?"
  ).run(id);
}


function stockUp(id) {
  return database.prepare(
    "UPDATE products SET stock = stock + 1 WHERE id = ?"
  ).run(id);
}




function stockReload(id , cantidad) {
  return database.prepare(
    "UPDATE products SET stock = ? WHERE id = ?"
  ).run(cantidad , id);
}




// ---------------------- ABM (usado por la API) ----------------------

function crearProducto(producto) {
    const resultado = database.prepare(`
        INSERT INTO products (id_Category, name, price, images_main, images_2, images_3, images_4, description, stock, maspedido)
        VALUES (@id_Category, @name, @price, @images_main, @images_2, @images_3, @images_4, @description, @stock, @maspedido)
    `).run(producto);

    return getProductoPorId(resultado.lastInsertRowid);
}

function actualizarProducto(id, producto) {
    database.prepare(`
        UPDATE products SET
            id_Category = @id_Category,
            name = @name,
            price = @price,
            images_main = @images_main,
            images_2 = @images_2,
            images_3 = @images_3,
            images_4 = @images_4,
            description = @description,
            stock = @stock,
            maspedido = @maspedido
        WHERE id = @id
    `).run({ ...producto, id });

    return getProductoPorId(id);
}

function contarProductos() {
    return database.prepare("SELECT COUNT(*) AS total FROM products").get().total;
}

function eliminarProducto(id) {
    return database.prepare("DELETE FROM products WHERE id = ?").run(id);
}

module.exports = { productosRandom, productosMasLlevados, getCategoriaProductos, getTodosProductos, getProductoPorId, productosRandomDelamismaCategoria , stockDown , stockUp , stockReload , ordenarProductos, crearProducto, actualizarProducto, eliminarProducto, contarProductos };
