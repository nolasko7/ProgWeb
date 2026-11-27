const userService = require('../../services/userService');
const authService = require('../../services/authService');

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

// POST /api/auth/login  body: { "email": "...", "password": "..." }
async function login(req, res) {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ error: 'email y password son obligatorios' });
    }

    const usuario = await authService.verificarCredenciales(email, password);
    if (!usuario) {
        // Mismo mensaje para email inexistente y contraseña incorrecta
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    res.status(200).json({
        token: authService.generarToken(usuario),
        tokenType: 'Bearer',
        expiresIn: authService.JWT_EXPIRES_IN,
        usuario
    });
}

// GET /api/auth/me  (ruta protegida: requiere token)
function me(req, res) {
    const usuario = userService.getUsuarioPorId(req.user.id);
    if (!usuario) {
        return res.status(401).json({ error: 'El usuario del token ya no existe' });
    }

    res.status(200).json(usuario);
}

module.exports = { register, login, me };
