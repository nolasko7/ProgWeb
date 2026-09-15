const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../../public/data/users.json');

function registrarUsuario(nombre, apellido, email, password) {
    // Leer el archivo JSON
    const datos = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));

    // Verificar si el email ya existe
    if (datos.usuarios.some(u => u.email === email)) {
        return {
            exito: false,
            errores: [{ campo: "email", mensaje: "El email ya está registrado" }]
        };
    }

    // Agregar nuevo usuario
    datos.usuarios.push({
        id: datos.usuarios.length + 1,
        nombre,
        apellido,
        email,
        password
    });

    // Guardar en el archivo
    fs.writeFileSync(usersFile, JSON.stringify(datos, null, 2));

    return { exito: true, mensaje: "Registro exitoso" };
}

module.exports = { registrarUsuario };