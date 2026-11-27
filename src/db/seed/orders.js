// Carga pedidos de prueba para tener datos de ventas en el dashboard.
// Uso: npm run seed-orders   (primero correr npm run seed-users, porque los pedidos son de esos clientes)
// Solo carga si la tabla orders está vacía, así no se duplican. Son SOLO para desarrollo.
require('../../config/env');
require('../init');
const db = require('../connection');

// Cada pedido: email del cliente, hace cuántos días se hizo, estado y productos [id, cantidad]
const pedidos = [
    { email: 'cliente@miecommerce.com', dias: 28, status: 'entregado', items: [[7, 1], [18, 2]] },
    { email: 'maria@miecommerce.com', dias: 26, status: 'entregado', items: [[8, 3], [9, 4], [10, 2]] },
    { email: 'juan@miecommerce.com', dias: 24, status: 'entregado', items: [[17, 1], [18, 1]] },
    { email: 'cliente@miecommerce.com', dias: 21, status: 'entregado', items: [[21, 2], [3, 1]] },
    { email: 'maria@miecommerce.com', dias: 19, status: 'entregado', items: [[15, 1], [16, 2]] },
    { email: 'juan@miecommerce.com', dias: 17, status: 'entregado', items: [[29, 1], [22, 1]] },
    { email: 'cliente@miecommerce.com', dias: 14, status: 'entregado', items: [[8, 2], [9, 3]] },
    { email: 'maria@miecommerce.com', dias: 12, status: 'enviado', items: [[7, 2], [28, 1]] },
    { email: 'juan@miecommerce.com', dias: 10, status: 'enviado', items: [[21, 3], [23, 2]] },
    { email: 'cliente@miecommerce.com', dias: 8, status: 'enviado', items: [[4, 1], [7, 1]] },
    { email: 'maria@miecommerce.com', dias: 6, status: 'enviado', items: [[18, 1], [9, 2]] },
    { email: 'juan@miecommerce.com', dias: 4, status: 'pendiente', items: [[16, 1], [26, 1]] },
    { email: 'cliente@miecommerce.com', dias: 3, status: 'pendiente', items: [[8, 1], [21, 1], [10, 1]] },
    { email: 'maria@miecommerce.com', dias: 2, status: 'pendiente', items: [[13, 1]] },
    { email: 'juan@miecommerce.com', dias: 1, status: 'pendiente', items: [[7, 1], [24, 2]] },
];

const yaHayPedidos = db.prepare('SELECT COUNT(*) AS total FROM orders').get().total > 0;
if (yaHayPedidos) {
    console.log('Ya hay pedidos cargados, no se agregan más.');
    process.exit(0);
}

const buscarUsuario = db.prepare('SELECT id FROM users WHERE email = ?');
const buscarPrecio = db.prepare('SELECT price FROM products WHERE id = ?');
const insertarPedido = db.prepare(
    "INSERT INTO orders (user_id, total, status, created_at) VALUES (?, ?, ?, datetime('now', ?))"
);
const insertarItem = db.prepare(
    'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)'
);

// transaction: si algo falla en el medio, no queda nada cargado a medias
const cargar = db.transaction(() => {
    for (const pedido of pedidos) {
        const usuario = buscarUsuario.get(pedido.email);
        if (!usuario) {
            throw new Error(`No existe ${pedido.email}. Corré primero: npm run seed-users`);
        }

        // El precio de cada item es el precio actual del producto
        const items = pedido.items.map(([productId, cantidad]) => ({
            productId,
            cantidad,
            precio: buscarPrecio.get(productId).price,
        }));
        const total = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

        const { lastInsertRowid } = insertarPedido.run(usuario.id, total, pedido.status, `-${pedido.dias} days`);
        for (const item of items) {
            insertarItem.run(lastInsertRowid, item.productId, item.cantidad, item.precio);
        }
    }
});

cargar();
console.log(`Se cargaron ${pedidos.length} pedidos de prueba.`);
