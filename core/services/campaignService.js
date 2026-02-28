const db = require('../database/db');

function createCampaign(name) {
  const result = db.prepare(`
    INSERT INTO campaigns (name)
    VALUES (?)
  `).run(name);

  return result.lastInsertRowid;
}

function getCampaigns() {
  return db.prepare(`
    SELECT * FROM campaigns
    ORDER BY created_at DESC
  `).all();
}

module.exports = {
  createCampaign,
  getCampaigns
};