  const database = require("../db/index");

  function obtenerCategoriaName(id){

    const categoria = database.prepare("SELECT name FROM categories WHERE id = ? ").get(id);

    return categoria;

  }

  function getCategorias(){
    const categorias = database.prepare("SELECT * FROM categories").all();
    return categorias
  }


  module.exports = {obtenerCategoriaName , getCategorias}