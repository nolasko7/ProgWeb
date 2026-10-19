const db = require("../db");

function registrarUsuario(nombre, apellido, email, password) {
    const existente = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existente) {
        return {
            exito: false,
            errores: [{ campo: "email", mensaje: "El email ya está registrado" }]
        };
    }

    try {
        const name = `${nombre} ${apellido}`;
        // TODO: reemplazar por bcrypt.hash(password, 10) cuando corresponda
        const password_hash = password;

        const stmt = db.prepare(
            "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)"
        );
        stmt.run(name, email, password_hash);

        return { exito: true, mensaje: "Registro exitoso" };

    } catch (error) {
        console.error(error);
        return {
            exito: false,
            errores: [{ campo: "general", mensaje: "Error interno al registrar el usuario" }]
        };
    }
}

module.exports = { registrarUsuario };