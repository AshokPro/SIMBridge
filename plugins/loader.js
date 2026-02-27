const fs = require('fs');
const path = require('path');

function loadPlugins(app, api) {
  const pluginsDir = path.join(__dirname, 'available');

  if (!fs.existsSync(pluginsDir)) {
    console.log('No plugins directory found.');
    return;
  }

  const plugins = fs.readdirSync(pluginsDir);

  plugins.forEach(plugin => {
    try {
      const pluginPath = path.join(pluginsDir, plugin);
      const pluginModule = require(pluginPath);
      pluginModule(app, api);
      console.log(`Loaded plugin: ${plugin}`);
    } catch (err) {
      console.error(`Failed to load plugin ${plugin}:`, err.message);
    }
  });
}

module.exports = loadPlugins;