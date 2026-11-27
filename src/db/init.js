const db = require("./connection");

const categories = require("./schema/categories");
const products = require("./schema/products");
const user = require("./schema/users");
const orders = require("./schema/orders");
const orderItems = require("./schema/order_items");

db.exec(categories);
db.exec(products);
db.exec(user);
db.exec(orders);
db.exec(orderItems);

// Migración: las bases creadas antes del sprint 6 no tienen la columna "role" en users
const columnasUsers = db.prepare("PRAGMA table_info(users)").all().map(c => c.name);
if (!columnasUsers.includes("role")) {
    db.exec("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'consumer' CHECK (role IN ('consumer', 'admin'))");
}
