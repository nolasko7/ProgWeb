const userService = require('../services/userService');
const { getCategorias } = require('../models/categoryModel');

/**
 * Carga el usuario de la sesión y lo deja disponible en todas las vistas (res.locals.user).
 * Se vuelve a leer de la base para tener el rol actualizado.
 */
function cargarUsuario(req, res, next) {
    res.locals.user = null;

    if (req.session && req.session.user) {
        const usuario = userService.getUsuarioPorId(req.session.user.id);
        if (usuario) {
            req.session.user = usuario;
            res.locals.user = usuario;
        } else {
            delete req.session.user; // el usuario ya no existe
        }
    }

    next();
}

// Solo personas logueadas (si no, al login)
function requireLogin(req, res, next) {
    if (req.session.user) {
        return next();
    }
    req.session.flash = 'Iniciá sesión para continuar.';
    res.redirect('/login');
}

// Solo personas NO logueadas (login y registro)
function soloInvitados(req, res, next) {
    if (!req.session.user) {
        return next();
    }
    res.redirect('/');
}

// Solo administradores (si está logueado sin permisos -> 403)
function requireAdminSession(req, res, next) {
    if (!req.session.user) {
        req.session.flash = 'Iniciá sesión para continuar.';
        return res.redirect('/login');
    }
    if (req.session.user.role !== 'admin') {
        return res.status(403).render('pages/error', {
            titulo: 'Acceso denegado',
            code: 403,
            message: 'No tenés permisos para acceder a esta sección.',
            categories: getCategorias()
        });
    }
    next();
}

module.exports = { cargarUsuario, requireLogin, soloInvitados, requireAdminSession };
