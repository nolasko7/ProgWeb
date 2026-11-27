// Crea (o promueve) el usuario administrador con los datos del .env
// Uso: npm run crear-admin
const bcrypt = require('bcrypt');
const { BCRYPT_SALT_ROUNDS } = require('../../config/env');
require('../init'); // asegura que existan las tablas y la columna role
const userModel = require('../../models/userModel');

const { ADMIN_NAME = 'Administrador', ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Completá ADMIN_EMAIL y ADMIN_PASSWORD en el .env (ver .env.example).');
    process.exit(1);
}

(async () => {
    const existente = userModel.getUsuarioConPasswordPorEmail(ADMIN_EMAIL);

    if (existente) {
        userModel.actualizarRol(existente.id, 'admin');
        console.log(`El usuario ${existente.email} ahora es admin.`);
        return;
    }

    const password_hash = await bcrypt.hash(ADMIN_PASSWORD, BCRYPT_SALT_ROUNDS);
    const admin = userModel.crearUsuario({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL.toLowerCase(),
        password_hash,
        role: 'admin'
    });
    console.log(`Administrador creado: ${admin.email}`);
})();
