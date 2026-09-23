module.exports = `

CREATE TABLE IF NOT EXISTS products (

    id INTEGER PRIMARY KEY, 
    id_Category INTEGER NOT NULL, 

    name TEXT NOT NULL,
    
    price REAL NOT NULL, 

    images_main TEXT NOT NULL , 
    images_2 TEXT ,
    images_3 TEXT , 
    images_4 TEXT ,

    description TEXT ,

    stock INTEGER NOT NULL ,
    maspedido INTEGER DEFAULT 0
    
    FOREING KEY (id_category) REFERENCE categories(id)
)
`;