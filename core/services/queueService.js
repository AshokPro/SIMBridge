const db = require('../database/db');

function addToQueue(contactId, phone, message) {
  db.prepare(`
    INSERT INTO message_queue (contact_id, phone, message)
    VALUES (?, ?, ?)
  `).run(contactId, phone, message);
}

function getNextPending() {
  return db.prepare(`
    SELECT * FROM message_queue
    WHERE status = 'pending'
    ORDER BY id ASC
    LIMIT 1
  `).get();
}

function updateStatus(id, status, error = null) {
  db.prepare(`
    UPDATE message_queue
    SET status = ?, error = ?
    WHERE id = ?
  `).run(status, error, id);
}

module.exports = {
  addToQueue,
  getNextPending,
  updateStatus
};