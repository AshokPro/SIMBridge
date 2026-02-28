const express = require('express');
const loadPlugins = require('../plugins/loader');
const pluginAPI = require('./pluginAPI');
const runMigrations = require('./database/migrations');
const config = require('../config/default.config.json');
const contactsRoutes = require('./routes/contacts');
const { sendSMS } = require('./services/smsService');
const sendRoutes = require('./routes/send');
const { processQueue } = require('./services/worker');
const usageRoutes = require('./routes/usage');
const controlRoutes = require('./routes/control');

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

app.get('/test-sms', async (req, res) => {
  const result = await sendSMS('9999999999', 'Hello from SIMBridge');
  res.json(result);
});

app.use('/contacts', contactsRoutes);
app.use('/send', sendRoutes);
app.use('/usage', usageRoutes);
app.use('/control', controlRoutes);

runMigrations();
loadPlugins(app, pluginAPI);
processQueue();

app.listen(PORT, () => {
  console.log(`${config.appName} running on http://localhost:${PORT}`);
});