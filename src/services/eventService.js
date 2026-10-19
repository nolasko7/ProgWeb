const WebSocket = require('ws');
const { EVENTOS, crearMensaje, interpretarMensaje } = require('../ws/protocol');

// El servicio mantiene el conjunto de conexiones abiertas y centraliza los envíos.
const conexionesActivas = new Set();

// Conecta los eventos del servidor ws con el registro central de conexiones.
function iniciarServicioEventos(servidorWebSocket, procesarSesion) {
    servidorWebSocket.on('connection', (conexion, solicitud) => {
        conexionesActivas.add(conexion);
        console.log('[WS] Cliente conectado');

        // Lee la cookie del handshake para asociar esta conexión a la sesión Express.
        procesarSesion(solicitud, {}, () => {
            conexion.sessionID = solicitud.sessionID;
            console.log('[WS] Sesión de la conexión:', conexion.sessionID);
        });

        emitirAConexion(conexion, EVENTOS.CONNECTED, {
            message: 'bienvenido al servidor'
        });

        conexion.on('message', (mensaje) => {
            const datos = interpretarMensaje(mensaje);

            if (!datos) {
                emitirAConexion(conexion, EVENTOS.ERROR, {
                    message: 'Formato inválido; se espera { type, payload }'
                });
                return;
            }

            console.log('[WS] Evento recibido:', datos.type, datos.payload);
        });

        // Elimina las conexiones cerradas para no intentar volver a enviarles eventos.
        conexion.on('close', () => {
            conexionesActivas.delete(conexion);
            console.log('[WS] Cliente desconectado');
        });

        conexion.on('error', (error) => {
            console.error('[WS] Error:', error);
        });
    });
}

// Envía un evento a una sola conexión activa usando el protocolo JSON común.
function emitirAConexion(conexion, tipo, contenido) {
    if (conexion.readyState === WebSocket.OPEN) {
        conexion.send(crearMensaje(tipo, contenido));
    }
}

// Envía un evento a cada conexión activa, sin importar la sesión.
function emitirATodas(tipo, contenido) {
    conexionesActivas.forEach((conexion) => {
        emitirAConexion(conexion, tipo, contenido);
    });
}

// Envía un evento solo a las conexiones que pertenecen a la misma sesión.
function emitirASesion(sessionID, tipo, contenido) {
    conexionesActivas.forEach((conexion) => {
        if (conexion.sessionID === sessionID) {
            emitirAConexion(conexion, tipo, contenido);
        }
    });
}

// Publica el contador privado de la sesión y, si corresponde, el stock global.
function emitirActualizacionCarrito(sessionID, contador, productosStock = []) {
    emitirASesion(sessionID, EVENTOS.CARRITO_ACTUALIZADO, { contador });

    if (productosStock.length > 0) {
        emitirATodas(EVENTOS.STOCK_ACTUALIZADO, { productos: productosStock });
    }
}

module.exports = {
    iniciarServicioEventos,
    emitirAConexion,
    emitirATodas,
    emitirASesion,
    emitirActualizacionCarrito
};
