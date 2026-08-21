const express = require('express')

const app = express();

const path = require("path");

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

//ROUTES -

app.get("/", (req, res) => {
    res.render("pages/index");
});

app.get("/product/:id", (req, res) => {
    res.render("pages/product");
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