const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

// Hash de una contraseña cualquiera: se compara contra este cuando el email no existe,
// así la respuesta tarda lo mismo y no se puede adivinar qué emails están registrados.
const HASH_FALSO = bcrypt.hashSync('contraseña-que-no-existe', 10);

function sinPassword(usuario) {
    const { password_hash, ...publico } = usuario;
    return publico;
}

/**
 * Verifica email y contraseña (lo usan el login de la API y el de las vistas EJS).
 * Devuelve el usuario (sin el hash) o null si las credenciales no son válidas.
 */
async function verificarCredenciales(email, password) {
    if (typeof email !== 'string' || typeof password !== 'string') {
        return null;
    }

    const usuario = userModel.getUsuarioConPasswordPorEmail(email.trim());
    const coincide = await bcrypt.compare(password, usuario ? usuario.password_hash : HASH_FALSO);

    if (!usuario || !coincide) {
        return null;
    }

    return sinPassword(usuario);
}

// Genera un JWT con los datos necesarios para identificar al usuario
function generarToken(usuario) {
    const payload = { id: usuario.id, email: usuario.email, name: usuario.name, role: usuario.role };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN, subject: String(usuario.id) });
}

/**
 * Verifica que el token sea auténtico y no esté vencido.
 * Devuelve el payload o lanza el error de jsonwebtoken (TokenExpiredError / JsonWebTokenError).
 */
function verificarToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = { verificarCredenciales, generarToken, verificarToken, JWT_EXPIRES_IN };
