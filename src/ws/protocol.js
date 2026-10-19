
// Nombres de eventos que comparten el servidor y los navegadores.
const EVENTOS = {
    CONNECTED: "connected",
    CARRITO_ACTUALIZADO: "carrito:actualizado",
    STOCK_ACTUALIZADO: "stock:actualizado",
    ERROR: "error",
};

// Todos los eventos usan el mismo formato: { type, payload }.
function crearMensaje(type, payload) {
    return JSON.stringify({type, payload});
}

// Convierte y valida un mensaje recibido desde el navegador.
function interpretarMensaje(message) {
    try {
        const data = JSON.parse(message.toString());
        if (!data.type || !data.payload) return null;
        return data;
    } catch (error) {
        return null;
    }
}

module.exports = { EVENTOS, crearMensaje, interpretarMensaje };
