// Carga las variables de entorno desde el archivo .env (ver .env.example)
require('dotenv').config({ quiet: true });

// Variables que la app necesita sí o sí para arrancar (las claves secretas NO van en el código)
const REQUERIDAS = ['SESSION_SECRET'];

const faltantes = REQUERIDAS.filter(nombre => !process.env[nombre]);
if (faltantes.length > 0) {
    console.error(`Faltan variables de entorno: ${faltantes.join(', ')}.`);
    console.error('Copiá el archivo .env.example como .env y completalo.');
    process.exit(1);
}

module.exports = {
    PORT: process.env.PORT || 3000,
    SESSION_SECRET: process.env.SESSION_SECRET,
    BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 10
};
