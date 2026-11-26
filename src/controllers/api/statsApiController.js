const statsService = require('../../services/statsService');

// GET /api/stats
function summary(req, res) {
    res.status(200).json(statsService.getStats());
}

module.exports = { summary };
