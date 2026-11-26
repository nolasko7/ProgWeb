# ProgWeb – E-commerce

    npm install
    npm run dev        # servidor en http://localhost:3000
    npm run tailwind   # compila el CSS

## Estructura

```
app.js              arma express, middlewares y monta src/routes
docs/               documentación (guía de tailwind)
public/             css e imágenes estáticas
src/
  config/           configuración (sesión)
  db/
    connection.js   conexión a SQLite (database.db)
    init.js         crea las tablas
    schema/         SQL de cada tabla
    seed/           datos iniciales
  models/           SOLO consultas SQL (xxxModel.js)
  services/         lógica de negocio, arma los datos (xxxService.js)
  controllers/      reciben req, llaman al service y responden (xxxController.js)
  routes/           solo URLs (xxxRoutes.js); index.js junta todas
  middlewares/      carrito en sesión, manejo de errores 404/500
  utils/            validaciones
  types/            typedefs JSDoc
  views/            pages/ y partials/ EJS
  websocket.js      sincronización del carrito en tiempo real
```

Regla de capas: `routes → controllers → services → models → db`.
Los controllers no tocan la base directo; los models no saben de req/res.

## API REST (Sprint 5)

Todas las rutas están bajo `/api`, responden JSON y tienen CORS habilitado (`src/routes/api/`).
Los controllers de la API (`src/controllers/api/`) usan los mismos services que las vistas EJS: no hay SQL en los controllers.

| Método | Ruta | Descripción | Respuesta |
|---|---|---|---|
| GET | `/api/products` | Listado de productos | 200 |
| GET | `/api/products/:id` | Detalle de un producto | 200 / 400 / 404 |
| POST | `/api/products` | Crea un producto | 201 / 400 |
| PUT | `/api/products/:id` | Modifica un producto (se pueden mandar solo los campos a cambiar) | 200 / 400 / 404 |
| DELETE | `/api/products/:id` | Elimina un producto | 200 / 404 |
| GET | `/api/categories` | Listado de categorías | 200 |
| GET | `/api/categories/:id` | Detalle de una categoría | 200 / 400 / 404 |
| POST | `/api/categories` | Crea una categoría | 201 / 400 |
| PUT | `/api/categories/:id` | Modifica una categoría | 200 / 400 / 404 |
| DELETE | `/api/categories/:id` | Elimina una categoría (no se puede si tiene productos) | 200 / 404 / 409 |
| GET | `/api/stats` | `{ "totalProducts": X, "totalCategories": Y }` | 200 |

Ejemplo de body para crear un producto:

```json
{
  "name": "Mate de calabaza",
  "price": 12000,
  "id_Category": 5,
  "images_main": "/images/Hogar.png",
  "description": "Mate artesanal",
  "stock": 10
}
```

Los errores devuelven `{ "error": "mensaje" }` (y `detalles` con la lista de problemas si son errores de validación).
