import fs from "fs";

import path from "path";
import runPluginTest from "./download-plugins-tester";


function loadPluginSync() {
	const pluginDir = path.join(__dirname, "../source-plugins");
	const files = fs.readdirSync(pluginDir);
	const pluginFiles = files.filter((file) => file.endsWith("-plugin.js"));

	const plugins = [];

	for (const pluginFile of pluginFiles) {

		const PluginModule = require(path.join(pluginDir, pluginFile)); 
		const Plugin = PluginModule.default;
		const pluginInstance = new Plugin();

		plugins.push({ pluginInstance, pluginFile });
	}

	return plugins;
}


function loadSourceSync() {
	const pluginDir = path.join(__dirname, "../source-plugins");
	const files = fs.readdirSync(pluginDir);
	const pluginFiles = files.filter((file) => file.endsWith("-plugin.js"));

	const plugins = [];

	for (const pluginFile of pluginFiles) {
		const PluginModule = require(path.join(pluginDir, pluginFile)); // Using require for synchronous loading
		const Plugin = PluginModule.default;
		const sourceInstance = new Plugin();

		plugins.push(sourceInstance);
	}

	return plugins;
}

// Load plugins and run tests
const sourceInstances = loadSourceSync();

// Load plugins and run tests
const plugins = loadPluginSync();
for (const plugin of plugins) {
	runPluginTest(plugin.pluginInstance, sourceInstances, plugin.pluginFile);
}
