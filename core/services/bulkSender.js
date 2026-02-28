const db = require('../database/db');
const { addToQueue } = require('./queueService');
const { createCampaign } = require('./campaignService');
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


async function sendBulk(contactIds, message, campaignName = "Untitled Campaign") {
  const campaignId = createCampaign(campaignName);

  const contacts = getContactsByIds(contactIds);

  for (const contact of contacts) {
    const personalizedMessage = applyTemplate(message, contact);
    addToQueue(contact.id, contact.phone, personalizedMessage, campaignId);
  }

  return {
    campaignId,
    totalQueued: contacts.length,
    status: 'queued'
  };
}

module.exports = {
  sendBulk
};