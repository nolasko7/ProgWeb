////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 1. LIBRERIAS Y DEPENDENCIAS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// --- Nativas de Node ---
const path = require("path");
const http = require("http");                 // [WS] necesario para compartir el servidor entre Express y WebSocket

// --- Librerias externas ---
const express = require("express"); //express
const session = require("express-session"); // necesaria para carrito spress session 
const expressLayouts = require("express-ejs-layouts"); // necesaria para layouts
const WebSocket = require("ws");              // [WS] libreria de WebSockets

// --- Rutas ---
const routerCategory = require("./src/routes/routesCategory");
const routerProduct = require("./src/routes/routesProduct");
const routerCart = require("./src/routes/routesCart");
const routerRegister = require("./src/routes/routerRegister");
const search = require("./src/routes/search");

// --- Servicios y modelos ---
const productsService = require("./src/services/productsService");
const servicioEventos = require("./src/services/eventService");
const { contadorCarrito } = require("./src/services/cartService");
const getCategorias = require("./src/models/category");

// --- Base de datos (se ejecuta al requerirlo) ---
require("./src/db/schema/Iindex");


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 2. INICIALIZACION
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const app = express();
const PORT = process.env.PORT || 3000;
const categories = getCategorias.getCategorias();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 3. CONFIGURACION DE VISTAS Y LAYOUTS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.set("view engine", "ejs");                          // le dice a Express que use EJS para renderizar
app.set("views", path.join(__dirname, "src/views"));    // le dice donde buscar los archivos .ejs
app.use(expressLayouts);
app.set("layout", "pages/layouts");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 4. SESION Y CARRITO
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const sessionParser = session({
    secret: process.env.SESSION_SECRET || "desarrollo-secret", // firma que valida las cookies
    resave: false,   // no reescribe la sesion si nadie la modifico
    saveUninitialized: false,  // no crea / manda cookie hasta que guardemos algo de verdad
    cookie: {
        httpOnly: true
        // aca puede ir "maxAge" para que la sesion dure aunque se cierre el navegador
    }
});
app.use(sessionParser);

// Inicializa el carrito en la sesion y expone el contador a todas las vistas
app.use((req, res, next) => {
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
// 5. MIDDLEWARES GENERALES
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use(express.urlencoded({ extended: true })); // parsea el body de formularios HTML (<form method="POST">)
app.use(express.json());                         // parsea body JSON
app.use(express.static("public"));               // archivos estaticos

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 6. RUTAS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// --- Home ---
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

// --- Routers ---
app.use("/search", search);
app.use("/product", routerProduct);
app.use("/cart", routerCart);
app.use("/register", routerRegister);
app.use("/category", routerCategory);

// --- Paginas simples ---
app.get("/login", (req, res) => {
    res.render("pages/login", { titulo: "Login" });
});

app.get("/checkout", (req, res, next) => {
    try {
        res.render("pages/checkout", { titulo: "Checkout" });
    } catch (err) {
        next(err);
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 7. MANEJO DE ERRORES
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Error 500 (error no controlado)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render("pages/500");
});

// Error 404 (ruta no encontrada)
app.use((req, res) => {
    const contador = contadorCarrito(req.session.carrito);
    res.status(404).render("pages/error", {
        code: 404,
        message: "Página no encontrada",
        categories: categories,
        contador
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 8. [WS] SERVIDOR HTTP + WEBSOCKET
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// [WS] Servidor HTTP creado a partir de Express. Reemplaza al antiguo app.listen,
//      asi Express y WebSocket comparten el mismo puerto.
const server = http.createServer(app);

// [WS] Servidor WebSocket montado sobre el mismo servidor HTTP
const wss = new WebSocket.Server({ server });

// El servicio central registra conexiones, procesa mensajes y realiza los envíos WS.
servicioEventos.iniciarServicioEventos(wss, sessionParser);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 9. LISTEN
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// [WS] Se usa server.listen (no app.listen) para que el WebSocket funcione
server.listen(PORT, () => console.log("Server is Ready! ☝️🤓"));
