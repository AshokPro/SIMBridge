const db = require('../database/db');

function createContact(name, phone) {
  const stmt = db.prepare(`
    INSERT INTO contacts (name, phone)
    VALUES (?, ?)
  `);
  return stmt.run(name, phone);
}

function getAllContacts() {
  return db.prepare(`
    SELECT * FROM contacts ORDER BY created_at DESC
  `).all();
}

module.exports = {
  createContact,
  getAllContacts
};