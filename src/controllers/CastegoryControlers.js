



function categories (req , res ){
    
    const categoryName = req.params.categoryName;
    res.render('../views/pages/category', { categoryName });
}

module.exports = {categories}
