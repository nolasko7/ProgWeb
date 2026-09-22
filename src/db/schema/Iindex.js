const db = require("../index");

const categories = require("./categories");
const products = require("./products");

db.exec(categories);  
db.exec(products);     