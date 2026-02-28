const express = require('express');
const router = express.Router();
const { sendBulk } = require('../services/bulkSender');

router.post('/', async (req, res) => {
  const { contactIds, message, campaignName } = req.body;

  if (!Array.isArray(contactIds) || contactIds.length === 0) {
    return res.status(400).json({ error: 'contactIds required' });
  }

  if (!message) {
    return res.status(400).json({ error: 'message required' });
  }

  try {
    const result = await sendBulk(
  contactIds,
  message,
  campaignName || "Untitled Campaign"
);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Bulk sending failed' });
  }
});

const db = require('../database/db');

router.get('/stats', (req, res) => {
  const stats = db.prepare(`
    SELECT status, COUNT(*) as count
    FROM message_queue
    GROUP BY status
  `).all();

  res.json(stats);
});

router.get('/pending', (req, res) => {
  const pending = db.prepare(`
    SELECT * FROM message_queue
    WHERE status = 'pending'
    ORDER BY id ASC
  `).all();

  res.json(pending);
});

module.exports = router;