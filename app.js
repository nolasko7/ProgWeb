const express = require('express')

const app = express();

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

//ROUTES -

app.get("/", (req, res) => {
    res.render("pages/index");
});

app.get("/product/:id", (req, res) => {
    const product = {
        category: "Bebidas",
        name: "Whisky Jack Daniels Honey 750ml",
        image: "https://cdn.awsli.com.br/2500x2500/2148/2148460/produto/137280811/42ceca746f.jpg",
        price: 19900,
        description:"Un verdaderamente fabuloso licor de whisky jack Daniels.Esta hecho con una mezcla de ricas especias y suave, miel tersa y el resultado es delicioso sobre hielo o cafe.\nAroma de caramelo y roble carbonizado, un poco de flor de naranja, miel de manuka y vainilla.\nBoca: grueso y cremoso, con notas de vainilla,roble tostado, miel de nuevo, un poco de albaricoque tambien.\nAcabado: De buena longitud - redondeado y rico.\nNo incluye vasos, la foto es solo ilustrativa"
    };
    res.render("pages/product",{product});
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