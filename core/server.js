const express = require('express');
const loadPlugins = require('../plugins/loader');
const pluginAPI = require('./pluginAPI');
const runMigrations = require('./database/migrations');
const config = require('../config/default.config.json');
const contactsRoutes = require('./routes/contacts');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('SIMBridge Core Running');
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: config.appName,
    version: require('../package.json').version
  });
});

app.use('/contacts', contactsRoutes);

runMigrations();
loadPlugins(app, pluginAPI);

app.listen(PORT, () => {
  console.log(`${config.appName} running on http://localhost:${PORT}`);
});