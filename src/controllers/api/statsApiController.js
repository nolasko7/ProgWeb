const statsService = require('../../services/statsService');

// GET /api/stats
function summary(req, res) {
    res.status(200).json(statsService.getStats());
}

// GET /api/stats/sales (solo admin)
function sales(req, res) {
    res.status(200).json(statsService.getSalesStats());
}

module.exports = { summary, sales };
