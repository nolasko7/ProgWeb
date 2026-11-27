module.exports = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'consumer' CHECK (role IN ('consumer', 'admin')),
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
`;
