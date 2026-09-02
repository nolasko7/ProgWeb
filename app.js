const express = require('express')

const routerCategory = require('./src/routes/routesCategory');
const routerProduct = require('./src/routes/routesProduct');
const products = require('./public/data/products');
const categories = require('./public/data/categories');
const app = express();

const path = require("path");

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", path.join(__dirname, "src/views"));


app.get("/", (req, res) => {
    const productosTec = [{
        id: 1,
        nombre: "Notebook Lenovo ThinkPad",
        precio: 499.99,
        imagen: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80"
    }, {
        id: 2,
        nombre: "Smart TV Samsung 55 pulgadas",
        precio: 499.99,
        imagen: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80"
    }, {
        id: 3,
        nombre: "Smartphone Xiaomi 128GB",
        precio: 499.99,
        imagen: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80"
    },];
    res.render("pages/index", { productosTec, categories });
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