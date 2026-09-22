
const database = require("../db/index");





function productosRandom(id){
    const productosDisponibles = id === undefined
        ? products
        : products.filter(product => product.id !== parseInt(id));

    return [...productosDisponibles]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
}

function productosRandomDelamismaCategoria(categoria, id){
    if(!categoria){
        return [];
    }
    const productosDisponibles = products.filter(product => {
        return product.category.toLowerCase() === categoria.toLowerCase() && product.id !== parseInt(id);
    });
    return [...productosDisponibles]
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
}

function productosMasLlevados(){
    return [...products].sort((a, b) => b.puntos - a.puntos).slice(0, 5)
}


function getTodosProductos(){
    return products
}

function getProductoPorId(id){
    return products.find(product => product.id === parseInt(id));
}

function getCategoriaProductos(categoria){

    if(typeof categoria !== "string" || categoria.trim() ===""){
        throw new Error("La categoria tiene que ser un texto no vacio ")
    }


    const prodcutosFiltrados = products.filter(product => {
        return product.category.toLocaleLowerCase() === categoria.toLocaleLowerCase() // funcion que hacea que las categorias no sean sencibles con las mayusculas 

    })

    return prodcutosFiltrados

}

function stockDown (id){

    products.forEach(p =>{

        if( p.id === id )
        {
        p.stock = p.stock - 1 ;
            return;
        }
    })
}

function stockUp (id){

    products.forEach(p =>{

        if( p.id === id )
        {
        p.stock = p.stock + 1 ;
            return;
        }
    })

}

function stockReload (id , cantidad){

    products.forEach( p=>{

        if(p.id === id){

            p.stock = p.stock + cantidad;

            
        }

    } )




}




module.exports = { productosRandom, productosMasLlevados, getCategoriaProductos, getTodosProductos, getProductoPorId, productosRandomDelamismaCategoria , stockDown , stockUp , stockReload};