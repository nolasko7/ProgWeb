const { WebSocketServer } = require('ws');

let wss; // instancia del servidor WebSocket

/**
 * Inicializa el WebSocketServer asociándolo al servidor HTTP existente.
 * @param {import('http').Server} server - servidor HTTP de Node
 */
function init(server) {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log(`[WS] Cliente conectado  (activos: ${wss.clients.size})`);

    ws.on('close', () => {
      console.log(`[WS] Cliente desconectado (activos: ${wss.clients.size})`);
    });
  });
}

/**
 * Envía un mensaje JSON a TODOS los clientes conectados.
 * @param {object} data - objeto que se serializa y envía
 */
function broadcast(data) {
  if (!wss) return;
  const msg = JSON.stringify(data);
  for (const client of wss.clients) {
    if (client.readyState === 1) client.send(msg);   // 1 = OPEN
  }
}

/**
 * Devuelve el Set de clientes activos (útil para debug / validación).
 */
function getClients() {
  return wss ? wss.clients : new Set();
}

module.exports = { init, broadcast, getClients };
