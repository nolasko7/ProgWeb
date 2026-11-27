const session = require('express-session');
const { SESSION_SECRET } = require('./env');

module.exports = session({
    secret: SESSION_SECRET,  //Esto es la firma que valida las cookies (viene del .env)
    resave: false, //Esto hace que la sesion no se vuelva a reescribir si alguien la toco
    saveUninitialized: false, //no crea / manda cookie hasta que guardemos algo de verdad
    cookie: {
        httpOnly : true,
        sameSite: 'lax'
        //aca puede ir un parametro para que la sesion dure aun si el navegador se cierra "maxAge"
    }
});
