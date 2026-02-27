const db = require('../database/db');
const { sendSMS, delay } = require('./smsService');
const config = require('../../config/default.config.json');

function getContactsByIds(ids) {
  const placeholders = ids.map(() => '?').join(',');
  return db.prepare(
    `SELECT * FROM contacts WHERE id IN (${placeholders})`
  ).all(...ids);
}

function applyTemplate(message, contact) {
  return message.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    return contact[key.trim()] || '';
  });
}

async function sendBulk(contactIds, message) {
  const results = [];
  const contacts = getContactsByIds(contactIds);

  for (const contact of contacts) {
    const personalizedMessage = applyTemplate(message, contact);

    const result = await sendSMS(contact.phone, personalizedMessage);

    results.push({
      contactId: contact.id,
      phone: contact.phone,
      status: result.success ? 'sent' : 'failed',
      error: result.error || null
    });

    if (!result.success) {
      if (result.error === 'Daily limit reached') {
        break;
      }
    }

    // Delay between messages (2 seconds default)
    await delay(2000);
  }

  return {
    totalRequested: contactIds.length,
    totalProcessed: results.length,
    results
  };
}

module.exports = {
  sendBulk
};