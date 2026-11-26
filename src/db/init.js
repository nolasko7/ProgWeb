const db = require("./connection");

const categories = require("./schema/categories");
const products = require("./schema/products");
const user = require("./schema/users");

db.exec(categories);  
db.exec(products);
db.exec(user);     