const db = require('./db');

function runMigrations() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  db.prepare(`
  CREATE TABLE IF NOT EXISTS usage (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    date TEXT,
    sent_count INTEGER DEFAULT 0
  )
  `).run();

  console.log('Database migrations completed.');
}

module.exports = runMigrations;