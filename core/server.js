const express = require('express');
const loadPlugins = require('../plugins/loader');
const pluginAPI = require('./pluginAPI');
const config = require('../config/default.config.json');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: config.appName,
    version: require('../package.json').version
  });
});

// Load plugins
loadPlugins(app, pluginAPI);

app.listen(PORT, () => {
  console.log(`${config.appName} running on http://localhost:${PORT}`);
});