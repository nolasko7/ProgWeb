const express = require("express")
const router = express.Router();
const {searchControl } = require('../controllers/searchControlers');


router.get("/" , searchControl);



module.exports = router;