import fs from "fs";
import path from "path";
import runPluginTest from "./source-plugins-tester";

// Function to load plugin synchronously
function loadPluginSync() {
	const pluginDir = path.join(__dirname, "../source-plugins");
	const files = fs.readdirSync(pluginDir);
	const pluginFiles = files.filter((file) => file.endsWith("-plugin.js"));

	const plugins = [];

	for (const pluginFile of pluginFiles) {
		const PluginModule = require(path.join(pluginDir, pluginFile)); // Using require for synchronous loading
		const Plugin = PluginModule.default;
		const pluginInstance = new Plugin();

		plugins.push({ pluginInstance, pluginFile });
	}

	return plugins;
}

// Load plugins and run tests
const plugins = loadPluginSync();
for (const plugin of plugins) {
	runPluginTest(plugin.pluginInstance, plugin.pluginFile);
}
