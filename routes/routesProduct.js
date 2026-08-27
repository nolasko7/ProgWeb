const express = require('express');
const router = express.Router();

module.exports = router;

router.get("/:id" ,(req,res)=>{
    const id = req.params.id;
    res.render("pages/product", { id });
})