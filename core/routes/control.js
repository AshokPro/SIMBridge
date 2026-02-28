const express = require('express');
const router = express.Router();
const { pauseWorker, resumeWorker } = require('../services/worker');

router.post('/pause', (req, res) => {
  pauseWorker();
  res.json({ status: 'paused' });
});

router.post('/resume', (req, res) => {
  resumeWorker();
  res.json({ status: 'resumed' });
});

module.exports = router;