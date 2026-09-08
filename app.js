////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ---------------------------- LIBRERIAS --------------------------------------------------------------------//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const express = require('express')
const routerCategory = require('./src/routes/routesCategory');
const routerProduct = require('./src/routes/routesProduct');
const products = require('./src/models/products');
const categories = require('./public/data/categories');
const routerCart = require('./src/routes/routesCart');
const session = require('express-session');
const app = express();



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ------------------------ Configuracion para poder utiliar el carrito --------------------------------------//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use(session({
    secret: process.env.SESSION_SECRET || "desarrollo-secret",  //Esto es la firma que valida las cookies 
    resave: false, //Esto hace que la sesion no se vuelva a reescribir si alguien la toco
    saveUninitialized: false, //no crea / manda cookie hasta que mguardemos algo de verdad (?(?( preguntar bien para que funciona)))
    cookie: {
        httpOnly : true
        //aca puede ir un parametro para que la sesion dure aun si el navegador se cierra "maxAge"

    }
}));

app.use((req , res , next) => {

    if(!req.session.carrito){
        /** @type {objetocarrito[]} */
        req.session.carrito = []
    }
    next();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ----------------------------------Configuracion del servidor ----------------------------------------------//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const path = require("path");

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", path.join(__dirname, "src/views"));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ----------------------------  app.use PARA PODER IR A LAS DISTNTAS RUTAS  ---------------------------------//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.get("/", (req, res) => {

    const productos = products.productosRandom();
    const productosMasLlevados = products.productosMasLlevados();
    
     res.render("pages/index", { categories, productos, productosMasLlevados });
});

app.use("/product", routerProduct);

app.use("/cart", routerCart);


app.get("/login", (req, res) => {
    res.render("pages/login");
});

app.get("/register", (req, res) => {
    res.render("pages/register");
});

app.get("/checkout", (req, res) => {
    res.render("pages/checkout");
});

app.use("/category", routerCategory);

app.use("/checkout", (req,res) => {
    res.render("pages/checkout")
});

//LISTEN
app.listen(PORT,
    () => console.log("Server is Ready! 🫡")
)

app.use((req, res) => {
    res.status(404).render('pages/error', {
        code: 404,
        message: 'Página no encontrada',
        categories: categories
    });
})