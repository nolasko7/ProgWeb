const express = require('express');
const router = express.Router();

module.exports = router;

router.get('/:categoryName', (req, res) => {
    const categoryName = req.params.categoryName;
    res.render('pages/category', { categoryName });
})