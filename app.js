////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ---------------------------- LIBRERIAS --------------------------------------------------------------------//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

require('./src/config/env'); // carga y valida el .env antes que todo
const express = require('express');
const http = require('http');
const path = require("path");
const expressLayouts = require('express-ejs-layouts');

require("./src/db/init"); // crea las tablas si no existen

const session = require('./src/config/session');
const { initCart } = require('./src/middlewares/cart');
const { notFound, serverError } = require('./src/middlewares/errorHandlers');
const routes = require('./src/routes');
const apiRoutes = require('./src/routes/api');
const ws = require('./src/websocket');

const app = express();
const { PORT } = require('./src/config/env');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ------------------------        Configuracion de vistas y layouts    --------------------------------------//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.set("view engine", "ejs"); //le dice a Express que use EJS para renderizar
app.set("views", path.join(__dirname, "src/views")); //le dice dónde buscar los archivos .ejs.
app.use(expressLayouts);
app.set("layout", "pages/layouts");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ----------------------------------  Middlewares  ----------------------------------------------------------//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use(express.static("public"));

// API REST (JSON) bajo /api. Va antes de la sesión para que sea stateless (no crea cookies ni carrito).
// Adentro tiene CORS, express.json() y errores en formato JSON (ver src/routes/api/index.js)
app.use("/api", apiRoutes);

app.use(express.json()); //parsea el body en formato JSON
app.use(express.urlencoded({ extended: true })); //parsea el body de formularios HTML (<form method="POST">). Sin esto, req.body sería undefined
app.use(session);
app.use(initCart);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ----------------------------------  Rutas (ver src/routes/index.js)  --------------------------------------//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use(routes);

app.use(serverError);
app.use(notFound);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ----------------------------------  LISTEN – servidor HTTP + WebSocket  -----------------------------------//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const server = http.createServer(app);
ws.init(server);
server.listen(PORT, () => console.log("Server is Ready! ☝️🤓"));
