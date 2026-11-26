const productService = require('../../services/productService');
const { normalizeId } = require('../../utils/normalizeId');

// GET /api/products
function list(req, res) {
    const productos = productService.getAllProducts();
    res.status(200).json(productos);
}

// GET /api/products/:id
function detail(req, res) {
    const id = normalizeId(req.params.id);
    if (id === null) {
        return res.status(400).json({ error: 'El id tiene que ser un número entero positivo' });
    }

    const producto = productService.getProductById(id);
    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json(producto);
}

// POST /api/products
function create(req, res) {
    const { producto, errores } = productService.createProduct(req.body || {});
    if (errores) {
        return res.status(400).json({ error: 'Datos inválidos', detalles: errores });
    }

    res.status(201).json(producto);
}

// PUT /api/products/:id
function update(req, res) {
    const id = normalizeId(req.params.id);
    if (id === null) {
        return res.status(400).json({ error: 'El id tiene que ser un número entero positivo' });
    }

    const resultado = productService.updateProduct(id, req.body || {});
    if (!resultado) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    if (resultado.errores) {
        return res.status(400).json({ error: 'Datos inválidos', detalles: resultado.errores });
    }

    res.status(200).json(resultado.producto);
}

// DELETE /api/products/:id
function remove(req, res) {
    const id = normalizeId(req.params.id);
    if (id === null) {
        return res.status(400).json({ error: 'El id tiene que ser un número entero positivo' });
    }

    const eliminado = productService.deleteProduct(id);
    if (!eliminado) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json({ message: 'Producto eliminado', producto: eliminado });
}

module.exports = { list, detail, create, update, remove };
