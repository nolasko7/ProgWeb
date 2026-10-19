
const { registrarUsuario } = require('./Usuarios');
const { validarFormulario, renderRegister } = require("../utils/validacion");

function metodoPost(req, res) {
    const nombre = (req.body.nombre ?? req.body.Nombre ?? "").trim();
    const apellido = (req.body.apellido ?? req.body.Apellido ?? "").trim();
    const email = (req.body.email ?? req.body.Email ?? "").trim();
    const password = (req.body.password ?? "").trim();
    const datos = { nombre, apellido, email, password };

    const errores = validarFormulario(datos);
    if (errores.length > 0) {
        return renderRegister(res, datos, errores);
    }

    const resultado = registrarUsuario(nombre, apellido, email, password);
    if (resultado.exito) {
        return res.redirect("/login");
    }

    return renderRegister(res, datos, resultado.errores || [{ campo: "general", mensaje: "Error al registrar el usuario." }]);
}

function metodoGet(req, res) {
    res.render("pages/register", { titulo: "Registro", datos: {}, errores: {} });
}

module.exports = { metodoGet, metodoPost };