
    const database = require("../db/index");


function productosRandom(id){
    
    const productosDisponibles = database.prepare("SELECT * FROM products ").all(); // hago esto ya que no tengo una llamada que me productos ramdom 
    
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
    return database.prepare("SELECT * FROM products ORDER BY maspedido DESC LIMIT 5").all();
}


function getTodosProductos(){
    return database.prepare("SELECT * FROM products").all();
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

// Descuenta una unidad del stock cuando un producto entra al carrito.
function descontarStock(id) {
  return database.prepare(
    "UPDATE products SET stock = stock - 1 WHERE id = ? AND stock > 0"
  ).run(id);
}


// Devuelve una unidad al stock cuando se reduce una cantidad del carrito.
function devolverStock(id) {
  return database.prepare(
    "UPDATE products SET stock = stock + 1 WHERE id = ?"
  ).run(id);
}




// Devuelve al stock todas las unidades de un producto que salen del carrito.
function devolverStockCantidad(id , cantidad) {
  return database.prepare(
    "UPDATE products SET stock = stock + ? WHERE id = ?"
  ).run(cantidad , id);
}




module.exports = { productosRandom, productosMasLlevados, getCategoriaProductos, getTodosProductos, getProductoPorId, productosRandomDelamismaCategoria , descontarStock , devolverStock , devolverStockCantidad , ordenarProductos};
