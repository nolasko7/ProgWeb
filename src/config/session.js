const session = require('express-session');

module.exports = session({
    secret: process.env.SESSION_SECRET || "desarrollo-secret",  //Esto es la firma que valida las cookies 
    resave: false, //Esto hace que la sesion no se vuelva a reescribir si alguien la toco
    saveUninitialized: false, //no crea / manda cookie hasta que mguardemos algo de verdad (?(?( preguntar bien para que funciona)))
    cookie: {
        httpOnly : true
        //aca puede ir un parametro para que la sesion dure aun si el navegador se cierra "maxAge"
    }
});
