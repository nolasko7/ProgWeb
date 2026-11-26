// Manejo de errores para la API: siempre responde JSON (nunca una vista EJS)

function apiNotFound(req, res) {
    res.status(404).json({ error: `Ruta ${req.method} ${req.originalUrl} no encontrada` });
}

// eslint-disable-next-line no-unused-vars
function apiServerError(err, req, res, next) {
    // JSON mal formado en el body (lo detecta express.json())
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'El body no es un JSON válido' });
    }

    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
}

module.exports = { apiNotFound, apiServerError };
