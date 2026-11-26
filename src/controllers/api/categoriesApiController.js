const categoryService = require('../../services/categoryService');
const { normalizeId } = require('../../utils/normalizeId');

// GET /api/categories
function list(req, res) {
    const categorias = categoryService.getAllCategories();
    res.status(200).json(categorias);
}

// GET /api/categories/:id
function detail(req, res) {
    const id = normalizeId(req.params.id);
    if (id === null) {
        return res.status(400).json({ error: 'El id tiene que ser un número entero positivo' });
    }

    const categoria = categoryService.getCategoryById(id);
    if (!categoria) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.status(200).json(categoria);
}

// POST /api/categories
function create(req, res) {
    const { categoria, errores } = categoryService.createCategory(req.body || {});
    if (errores) {
        return res.status(400).json({ error: 'Datos inválidos', detalles: errores });
    }

    res.status(201).json(categoria);
}

// PUT /api/categories/:id
function update(req, res) {
    const id = normalizeId(req.params.id);
    if (id === null) {
        return res.status(400).json({ error: 'El id tiene que ser un número entero positivo' });
    }

    const resultado = categoryService.updateCategory(id, req.body || {});
    if (!resultado) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    if (resultado.errores) {
        return res.status(400).json({ error: 'Datos inválidos', detalles: resultado.errores });
    }

    res.status(200).json(resultado.categoria);
}

// DELETE /api/categories/:id
function remove(req, res) {
    const id = normalizeId(req.params.id);
    if (id === null) {
        return res.status(400).json({ error: 'El id tiene que ser un número entero positivo' });
    }

    const resultado = categoryService.deleteCategory(id);
    if (!resultado) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    if (resultado.conflicto) {
        return res.status(409).json({ error: resultado.conflicto });
    }

    res.status(200).json({ message: 'Categoría eliminada', categoria: resultado.categoria });
}

module.exports = { list, detail, create, update, remove };
