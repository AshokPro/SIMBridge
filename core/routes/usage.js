const express = require('express');
const router = express.Router();
const { getUsage } = require('../services/usageService');
const config = require('../../config/default.config.json');

router.get('/', (req, res) => {
  const usage = getUsage();

  res.json({
    date: usage.date,
    sent: usage.sent_count,
    limit: config.dailyLimit,
    remaining: config.dailyLimit - usage.sent_count
  });
});

module.exports = router;