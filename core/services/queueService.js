const db = require('../database/db');

function addToQueue(contactId, phone, message, campaignId = null) {
  db.prepare(`
    INSERT INTO message_queue (contact_id, phone, message, campaign_id)
    VALUES (?, ?, ?, ?)
  `).run(contactId, phone, message, campaignId);
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

function incrementRetry(id) {
  db.prepare(`
    UPDATE message_queue
    SET retry_count = retry_count + 1,
        status = 'pending'
    WHERE id = ?
  `).run(id);
}

module.exports = {
  addToQueue,
  getNextPending,
  updateStatus
};