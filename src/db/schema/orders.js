module.exports = `
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        total REAL NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'pendiente',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
`;
