const express = require('express')

const routerCategory = require('./src/routes/routesCategory');
const routerProduct = require('./src/routes/routesProduct');
const products = require('./src/models/products');
const categories = require('./public/data/categories');
const app = express();

const path = require("path");

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", path.join(__dirname, "src/views"));


app.get("/", (req, res) => {

    const productos = products.productosRandom();
    const productosMasLlevados = products.productosMasLlevados();
    
     res.render("pages/index", { categories, productos, productosMasLlevados });
});

app.use("/products", routerProduct);

app.get("/cart", (req, res) => {
    res.render("pages/cart");
});

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