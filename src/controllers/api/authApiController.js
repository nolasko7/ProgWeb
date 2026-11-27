const userService = require('../../services/userService');

// POST /api/auth/register
async function register(req, res) {
    const resultado = await userService.registrarUsuario(req.body || {});

    if (resultado.emailDuplicado) {
        return res.status(409).json({ error: 'El email ya está registrado' });
    }
    if (resultado.errores) {
        return res.status(400).json({
            error: 'Datos inválidos',
            detalles: resultado.errores.map(e => `${e.campo}: ${e.mensaje}`)
        });
    }

    res.status(201).json(resultado.usuario);
}

module.exports = { register };
