const statsService = require('../services/statsService');
const productService = require('../services/productService');
const categoryService = require('../services/categoryService');

// GET /admin  (panel de administración)
function panel(req, res) {
    const categorias = categoryService.getAllCategories();
    const nombrePorId = Object.fromEntries(categorias.map(c => [c.id, c.name]));

    res.render('pages/admin', {
        titulo: 'Administración',
        stats: statsService.getStats(),
        productos: productService.getAllProducts(),
        categorias,
        nombrePorId
    });
}

module.exports = { panel };
