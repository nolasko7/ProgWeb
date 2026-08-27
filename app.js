const express = require('express')

const app = express();

const path = require("path");

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
//ROUTES -

app.get("/", (req, res) => {
    const productosTec = [{
        id: 1,
        nombre: "Notebook Lenovo ThinkPad",
        precio: 499.99,
        imagen: "https://images.unsplash.com/photo-1517336714731-4896894b5ce9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bm90ZWJvb2t8ZW58MHx8MHx8fDA%3D"
    }, {
        id: 2,
        nombre: "Smart TV Samsung 55 pulgadas",
        precio: 499.99,
        imagen: "https://images.unsplash.com/photo-1517336714731-4896894b5ce9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bm90ZWJvb2t8ZW58MHx8MHx8fDA%3D"
    }, {
        id: 3,
        nombre: "Smartphone Xiaomi 128GB",
        precio: 499.99,
        imagen: "https://images.unsplash.com/photo-1517336714731-4896894b5ce9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bm90ZWJvb2t8ZW58MHx8MHx8fDA%3D"
    },];
    res.render("pages/index", { productosTec });
});

app.get("/product/:id", (req, res) => {
    const product = {
        category: "Bebidas",
        name: "Whisky Jack Daniels Honey 750ml",
        image: "https://cdn.awsli.com.br/2500x2500/2148/2148460/produto/137280811/42ceca746f.jpg",
        price: 19900,
        description: "Un verdaderamente fabuloso licor de whisky jack Daniels.Esta hecho con una mezcla de ricas especias y suave, miel tersa y el resultado es delicioso sobre hielo o cafe.\nAroma de caramelo y roble carbonizado, un poco de flor de naranja, miel de manuka y vainilla.\nBoca: grueso y cremoso, con notas de vainilla,roble tostado, miel de nuevo, un poco de albaricoque tambien.\nAcabado: De buena longitud - redondeado y rico.\nNo incluye vasos, la foto es solo ilustrativa"
    };
    res.render("pages/product", { product });
});

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



//LISTEN
app.listen(PORT,
    () => console.log("Server is Ready! 🫡")
)