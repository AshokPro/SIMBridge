const express = require('express');
const router = express.Router();
const { sendBulk } = require('../services/bulkSender');

router.post('/', async (req, res) => {
  const { contactIds, message } = req.body;

  if (!Array.isArray(contactIds) || contactIds.length === 0) {
    return res.status(400).json({ error: 'contactIds required' });
  }

  if (!message) {
    return res.status(400).json({ error: 'message required' });
  }

  try {
    const result = await sendBulk(contactIds, message);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Bulk sending failed' });
  }
});

module.exports = router;