const userModel = require('../models/userModel');

function registrarUsuario(nombre, apellido, email, password) {
    return userModel.registrarUsuario(nombre, apellido, email, password);
}

module.exports = { registrarUsuario };
