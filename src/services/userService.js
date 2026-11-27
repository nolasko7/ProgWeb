const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const { validarFormulario } = require('../utils/validacion');
const { BCRYPT_SALT_ROUNDS } = require('../config/env');

const ROL_POR_DEFECTO = 'consumer';

function texto(valor) {
    return typeof valor === 'string' ? valor.trim() : '';
}

/**
 * Registra un usuario nuevo (lo usan el formulario EJS y la API).
 * Devuelve:
 *  - { usuario } si se registró (sin el hash de la contraseña)
 *  - { errores } si hay datos inválidos
 *  - { errores, emailDuplicado: true } si el email ya existe
 */
async function registrarUsuario(datosCrudos) {
    const datos = {
        nombre: texto(datosCrudos.nombre),
        apellido: texto(datosCrudos.apellido),
        email: texto(datosCrudos.email).toLowerCase(),
        password: typeof datosCrudos.password === 'string' ? datosCrudos.password : ''
    };

    const errores = validarFormulario(datos);
    if (errores.length > 0) {
        return { errores };
    }

    if (userModel.existeEmail(datos.email)) {
        return {
            errores: [{ campo: 'email', mensaje: 'El email ya está registrado' }],
            emailDuplicado: true
        };
    }

    // La contraseña nunca se guarda en texto plano
    const password_hash = await bcrypt.hash(datos.password, BCRYPT_SALT_ROUNDS);

    const usuario = userModel.crearUsuario({
        name: `${datos.nombre} ${datos.apellido}`,
        email: datos.email,
        password_hash,
        role: ROL_POR_DEFECTO
    });

    return { usuario };
}

function getUsuarioPorId(id) {
    return userModel.getUsuarioPorId(id);
}

module.exports = { registrarUsuario, getUsuarioPorId };
