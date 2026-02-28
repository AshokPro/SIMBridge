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

db.prepare(`
  CREATE TABLE IF NOT EXISTS message_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_id INTEGER,
    phone TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    retry_count INTEGER DEFAULT 0,
    error TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();


try {
  db.prepare(`
    ALTER TABLE message_queue
    ADD COLUMN retry_count INTEGER DEFAULT 0
  `).run();
} catch (e) {}

db.prepare(`
  CREATE TABLE IF NOT EXISTS campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

try {
  db.prepare(`
    ALTER TABLE message_queue
    ADD COLUMN campaign_id INTEGER
  `).run();
} catch (e) {}

  console.log('Database migrations completed.');
}

module.exports = runMigrations;