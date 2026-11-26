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
