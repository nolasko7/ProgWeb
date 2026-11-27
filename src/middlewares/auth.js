const authService = require('../services/authService');

/**
 * Middleware de autenticación para la API.
 * Exige la cabecera "Authorization: Bearer <token>" con un JWT válido y no vencido.
 * Si todo está bien, deja los datos del usuario en req.user.
 */
function verifyToken(req, res, next) {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({ error: 'Falta la cabecera Authorization' });
    }

    const [esquema, token] = header.split(' ');
    if (esquema !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Formato inválido. Usá: Authorization: Bearer <token>' });
    }

    try {
        const payload = authService.verificarToken(token);
        req.user = { id: payload.id, email: payload.email, name: payload.name, role: payload.role };
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'El token expiró, volvé a iniciar sesión' });
        }
        return res.status(401).json({ error: 'Token inválido' });
    }
}

module.exports = { verifyToken };
