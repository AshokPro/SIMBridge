const fs = require('fs');
const path = require('path');

function loadPlugins(app, api) {
  const pluginsDir = path.join(__dirname, 'available');

  if (!fs.existsSync(pluginsDir)) return;

  const plugins = fs.readdirSync(pluginsDir);

  plugins.forEach(plugin => {
    const pluginPath = path.join(pluginsDir, plugin);
    const pluginModule = require(pluginPath);
    pluginModule(app, api);
    console.log(`Loaded plugin: ${plugin}`);
  });
}

module.exports = loadPlugins;