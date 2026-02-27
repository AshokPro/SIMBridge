const runMigrations = require('./database/migrations');
const express = require('express');
const loadPlugins = require('../plugins/loader');
const pluginAPI = require('./pluginAPI');
const config = require('../config/default.config.json');
const { createContact, getAllContacts } = require('./models/contactModel');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

app.get('/', (req, res) => {
  res.send('SIMBridge Core Running');
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: config.appName,
    version: require('../package.json').version
  });
});

app.post('/contacts', (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone required' });
  }

  try {
    createContact(name, phone);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/contacts', (req, res) => {
  const contacts = getAllContacts();
  res.json(contacts);
});

// Load plugins
loadPlugins(app, pluginAPI);

runMigrations();

app.listen(PORT, () => {
  console.log(`${config.appName} running on http://localhost:${PORT}`);
});