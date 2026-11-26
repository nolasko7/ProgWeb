const express = require('express');
const router = express.Router();
const statsApi = require('../../controllers/api/statsApiController');

router.get('/', statsApi.summary);

module.exports = router;
