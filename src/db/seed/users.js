// Carga usuarios de prueba para poder entrar fácil al dashboard de React (y a la tienda).
// Uso: npm run seed-users
// Si un email ya existe, no lo vuelve a crear. Son SOLO para desarrollo: no usar en producción.
require('../../config/env');
const bcrypt = require('bcrypt');
const { BCRYPT_SALT_ROUNDS } = require('../../config/env');
require('../init'); // asegura que existan las tablas y la columna role
const userModel = require('../../models/userModel');

const usuariosDePrueba = [
    { name: 'Admin Dashboard', email: 'dashboard@miecommerce.com', password: 'admin123', role: 'admin' },
    { name: 'Vendedor', email: 'vendedor@miecommerce.com', password: 'admin123', role: 'admin' },
    // consumer: sirve para probar que el dashboard rechaza a quien no es admin
    { name: 'Cliente', email: 'cliente@miecommerce.com', password: 'cliente123', role: 'consumer' },
    { name: 'María Gómez', email: 'maria@miecommerce.com', password: 'cliente123', role: 'consumer' },
    { name: 'Juan Pérez', email: 'juan@miecommerce.com', password: 'cliente123', role: 'consumer' },
];

(async () => {
    for (const usuario of usuariosDePrueba) {
        if (userModel.existeEmail(usuario.email)) {
            console.log(`Ya existe: ${usuario.email}`);
            continue;
        }

        const password_hash = await bcrypt.hash(usuario.password, BCRYPT_SALT_ROUNDS);
        userModel.crearUsuario({ name: usuario.name, email: usuario.email, password_hash, role: usuario.role });
        console.log(`Creado: ${usuario.email} (${usuario.role})`);
    }
})();
