const userService = require('../services/userService');
const authService = require('../services/authService');
const { renderRegister } = require("../utils/validacion");

// GET /register
function metodoGet(req, res) {
    res.render("pages/register", { titulo: "Registro", datos: {}, errores: {} });
}

// POST /register
async function metodoPost(req, res) {
    const datos = {
        nombre: req.body.nombre ?? req.body.Nombre,
        apellido: req.body.apellido ?? req.body.Apellido,
        email: req.body.email ?? req.body.Email,
        password: req.body.password
    };

    const resultado = await userService.registrarUsuario(datos);
    if (resultado.usuario) {
        req.session.flash = 'Te registraste correctamente. Ya podés iniciar sesión.';
        return res.redirect("/login");
    }

    // No devolvemos la contraseña a la vista
    return renderRegister(res, { ...datos, password: '' }, resultado.errores);
}

// GET /login
function loginGet(req, res) {
    const flash = req.session.flash;
    req.session.flash = null;
    res.render("pages/login", { titulo: "Login", flash, error: null, email: '' });
}

// POST /login  (usa el mismo servicio de credenciales que la API)
async function loginPost(req, res, next) {
    const email = typeof req.body.email === 'string' ? req.body.email.trim() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    const usuario = await authService.verificarCredenciales(email, password);
    if (!usuario) {
        return res.status(401).render("pages/login", {
            titulo: "Login",
            flash: null,
            error: 'Email o contraseña incorrectos',
            email
        });
    }

    // Nueva sesión al loguearse (evita reutilizar un id de sesión anterior)
    req.session.regenerate(err => {
        if (err) return next(err);

        req.session.user = usuario;
        req.session.carrito = [];
        req.session.flash = `¡Hola, ${usuario.name}!`;
        req.session.save(errGuardar => {
            if (errGuardar) return next(errGuardar);
            res.redirect('/');
        });
    });
}

// POST /logout
function logout(req, res, next) {
    req.session.destroy(err => {
        if (err) return next(err);
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
}

module.exports = { metodoGet, metodoPost, loginGet, loginPost, logout };
