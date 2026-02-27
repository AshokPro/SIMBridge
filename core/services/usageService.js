const db = require('../database/db');
const config = require('../../config/default.config.json');

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function getUsage() {
  const today = getToday();
  let row = db.prepare('SELECT * FROM usage WHERE id = 1').get();

  if (!row) {
    db.prepare(`
      INSERT INTO usage (id, date, sent_count)
      VALUES (1, ?, 0)
    `).run(today);

    return { date: today, sent_count: 0 };
  }

  if (row.date !== today) {
    db.prepare(`
      UPDATE usage
      SET date = ?, sent_count = 0
      WHERE id = 1
    `).run(today);

    return { date: today, sent_count: 0 };
  }

  return row;
}

function incrementUsage(count = 1) {
  db.prepare(`
    UPDATE usage
    SET sent_count = sent_count + ?
    WHERE id = 1
  `).run(count);
}

function canSend(count = 1) {
  const usage = getUsage();
  return (usage.sent_count + count) <= config.dailyLimit;
}

module.exports = {
  getUsage,
  incrementUsage,
  canSend
};