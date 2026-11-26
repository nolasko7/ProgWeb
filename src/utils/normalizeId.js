// Convierte un id de la URL a número entero positivo. Devuelve null si no es válido.
function normalizeId(value) {
    if (value === undefined || value === null || value === '') {
        return null;
    }

    const id = Number(value);

    if (!Number.isInteger(id) || id <= 0) {
        return null;
    }

    return id;
}

module.exports = { normalizeId };
