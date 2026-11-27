const db = require("../db/connection");

// Columnas públicas: nunca devolvemos el hash de la contraseña fuera del model/service
const COLUMNAS_PUBLICAS = "id, name, email, role, created_at";

function crearUsuario({ name, email, password_hash, role }) {
    const resultado = db.prepare(
        "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)"
    ).run(name, email, password_hash, role);

    return getUsuarioPorId(resultado.lastInsertRowid);
}

function getUsuarioPorId(id) {
    return db.prepare(`SELECT ${COLUMNAS_PUBLICAS} FROM users WHERE id = ?`).get(id);
}

// Incluye password_hash: solo se usa para verificar la contraseña en el login
function getUsuarioConPasswordPorEmail(email) {
    return db.prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(?)").get(email);
}

function existeEmail(email) {
    return Boolean(db.prepare("SELECT 1 FROM users WHERE LOWER(email) = LOWER(?)").get(email));
}

function actualizarRol(id, role) {
    db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, id);
    return getUsuarioPorId(id);
}

module.exports = { crearUsuario, getUsuarioPorId, getUsuarioConPasswordPorEmail, existeEmail, actualizarRol };
