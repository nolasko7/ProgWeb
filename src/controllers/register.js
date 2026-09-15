
const { registrarUsuario } = require('./Usuarios');


function metodoPost (req , res){
    const nombre = req.body.nombre ?? req.body.Nombre;
    const apellido = req.body.apellido ?? req.body.Apellido;
    const email = req.body.email ?? req.body.Email;
    const { password } = req.body;
        const resultado = registrarUsuario(nombre, apellido, email, password);
        if (resultado.exito) {
            res.json({ success: true, message: resultado.mensaje });
        } else {
            res.status(400).json({ success: false, errores: resultado.errores });
        } 
}

function metodoGet (req , res ){
    res.render("pages/register");
}

module.exports = {metodoGet , metodoPost};