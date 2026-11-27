# ProgWeb – E-commerce

    npm install
    cp .env.example .env   # y completar los valores (claves secretas)
    npm run crear-admin    # crea el usuario administrador con los datos del .env
    npm run seed-users     # (opcional) usuarios de prueba, ya vienen cargados en database.db
    npm run dev            # servidor en http://localhost:3000
    npm run tailwind       # compila el CSS

## Usuarios de prueba

Ya están cargados en `database.db` (si se borran, se recrean con `npm run seed-users`).
Sirven para entrar a la tienda y al dashboard de React. **Solo para desarrollo.**

| Email | Contraseña | Rol |
|---|---|---|
| dashboard@miecommerce.com | admin123 | admin |
| vendedor@miecommerce.com | admin123 | admin |
| cliente@miecommerce.com | cliente123 | consumer (no entra al dashboard) |

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

## Seguridad (Sprint 6)

- **Usuarios** en la tabla `users` de SQLite, con rol `consumer` (por defecto) o `admin`.
  Las contraseñas se guardan hasheadas con **bcrypt**; nunca en texto plano.
- **Variables de entorno** en `.env` (no se sube a git; ver `.env.example`): `SESSION_SECRET`, `JWT_SECRET`, `JWT_EXPIRES_IN`, datos del admin.
  Si un valor tiene `#` o espacios, va entre comillas.
- La API usa **JWT** y las vistas EJS usan **sesiones** (`express-session`). Las dos validan las credenciales con el mismo servicio (`src/services/authService.js`).

### Endpoints de autenticación

| Método | Ruta | Descripción | Respuesta |
|---|---|---|---|
| POST | `/api/auth/register` | Registra un usuario (`nombre`, `apellido`, `email`, `password`) con rol consumer | 201 / 400 / 409 (email repetido) |
| POST | `/api/auth/login` | `{ "email", "password" }` → devuelve `{ token, tokenType, expiresIn, usuario }` | 200 / 400 / 401 |
| GET | `/api/auth/me` | Datos del usuario del token | 200 / 401 |

### Endpoints protegidos

Se manda el token en la cabecera `Authorization: Bearer <token>`.

| Ruta | Middleware | Sin token / token inválido o vencido | Usuario consumer | Admin |
|---|---|---|---|---|
| `GET /api/auth/me` | `verifyToken` | 401 | 200 | 200 |
| `POST/PUT/DELETE /api/products` | `verifyToken` + `requireAdmin` | 401 | 403 | 200 / 201 |
| `POST/PUT/DELETE /api/categories` | `verifyToken` + `requireAdmin` | 401 | 403 | 200 / 201 |

Los `GET` de productos, categorías y `/api/stats` siguen siendo públicos.

### Acceso a las vistas (sesión)

| Funcionalidad | Anónimo | Autenticado | Admin |
|---|---|---|---|
| Home, productos, categorías, búsqueda | ✅ | ✅ | ✅ |
| Login (`/login`) y registro (`/register`) | ✅ | ❌ (va al inicio) | ❌ (va al inicio) |
| Carrito (`/cart`) y checkout | ❌ (va al login) | ✅ | ✅ |
| Mis pedidos (`/orders`) | ❌ (va al login) | ✅ | ✅ |
| Administración (`/admin`) | ❌ (va al login) | ❌ (403) | ✅ |
| Cerrar sesión (`POST /logout`) | ❌ | ✅ | ✅ |

El header cambia según el rol. Los middlewares de las vistas están en `src/middlewares/sessionAuth.js` y los de la API en `src/middlewares/auth.js`.
