const db = require("../index");

const categories = require("./categories");
const products = require("./products");
const user = require("./users");

db.exec(categories);  
db.exec(products);
db.exec(user);     