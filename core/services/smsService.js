const config = require('../../config/default.config.json');

const { exec } = require('child_process');
const path = require('path');
const db = require('../database/db');


// Utility delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Basic SMS sender (Termux placeholder)
function sendViaTermux(phone, message, sim = 1) {
  return new Promise((resolve, reject) => {

    if (config.environment === 'development') {
      console.log(`[DEV MODE] SMS to ${phone}: ${message}`);
      return resolve(true);
    }

    const command = `termux-sms-send -s ${sim} -n ${phone} "${message}"`;

    exec(command, (error) => {
      if (error) {
        return reject(error);
      }
      resolve(true);
    });
  });
}

// Public send function
async function sendSMS(phone, message, options = {}) {
  const sim = options.sim || 1;

  try {
    await sendViaTermux(phone, message, sim);

    logMessage(phone, message, 'sent');

    return { success: true };

  } catch (err) {

    logMessage(phone, message, 'failed');

    return { success: false, error: err.message };
  }
}

// Log messages into DB
function logMessage(phone, message, status) {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT,
      message TEXT,
      status TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  db.prepare(`
    INSERT INTO messages (phone, message, status)
    VALUES (?, ?, ?)
  `).run(phone, message, status);
}

module.exports = {
  sendSMS,
  delay
};

