const userService = require('../services/userService');
const { renderRegister } = require("../utils/validacion");

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

// GET /register
function metodoGet(req, res) {
    res.render("pages/register", { titulo: "Registro", datos: {}, errores: {} });
}

module.exports = { metodoGet, metodoPost };
