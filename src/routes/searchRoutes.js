const express = require("express")
const router = express.Router();
const {searchControl } = require('../controllers/searchController');


router.get("/" , searchControl);



module.exports = router;