////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ---------------------------- LIBRERIAS --------------------------------------------------------------------//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const express = require('express')
const routerCategory = require('./src/routes/routesCategory');
const routerProduct = require('./src/routes/routesProduct');
const productsService = require('./src/services/productsService');
const categories = require('./public/data/categories');
const routerCart = require('./src/routes/routesCart');
const session = require('express-session');
const {contadorCarrito} = require('./src/models/carrtio')
const app = express();
const routerRegister = require('./src/routes/routerRegister');
const expressLayouts  =  require ( 'express-ejs-layouts' ) ;
const search = require('./src/routes/search');


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ------------------------        Configuracion de layouts             --------------------------------------//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "pages/layouts");

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
    if (!req.session) {
        return next();
    }
    if (!req.session.carrito) {
        /** @type {objetocarrito[]} */
        req.session.carrito = [];
    }
    res.locals.contador = contadorCarrito(req.session.carrito);
    next();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ----------------------------------Configuracion del servidor ----------------------------------------------//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const path = require("path");
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true })); //middleware que parsea el body de formularios HTML (<form method="POST">). Sin esto, req.body sería undefined
app.set("view engine", "ejs"); //le dice a Express que use EJS para renderizar
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "src/views")); //le dice dónde buscar los archivos .ejs.

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ----------------------------  app.use PARA PODER IR A LAS DISTNTAS RUTAS  ---------------------------------//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.get("/", (req, res) => {

    const productos = productsService.getRandomProducts();
    const flash = req.session.flash;
    req.session.flash = null;
    const productosMasLlevados = productsService.getMostRequestedProducts();
    const contador = contadorCarrito(req.session.carrito);

    res.render("pages/index", {
  titulo: "Inicio",
  categories,
  productos,
  productosMasLlevados,
  flash,
  contador
});
});

app.use("/search" , search);

app.use("/product", routerProduct);

app.use("/cart", routerCart);

app.get("/login", (req, res) => {
    res.render("pages/login", { titulo: "Login" });
});

app.use("/register", routerRegister);


app.get("/checkout", (req, res, next) => {
    try {
        res.render("pages/checkout", { titulo: "Checkout" });
    } catch (err) {
        next(err);
    }
});

app.use("/category", routerCategory);



app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render('pages/500');
});

app.use((req, res) => {
    const contador = contadorCarrito(req.session.carrito);
    res.status(404).render('pages/error', {
        code: 404,
        message: 'Página no encontrada',
        categories: categories,
        contador
    });
})
//LISTEN
app.listen(PORT,
    () => console.log("Server is Ready! ☝️🤓")
);