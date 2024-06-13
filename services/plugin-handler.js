import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PluginHandler {
	constructor() {}

	deleteDownloadPlugin(pluginName) {
		if (!pluginName.includes("-downloader-plugin.js")) throw new Error("Plugin not found!");
		const pluginPath = path.join(__dirname, `../download-plugins/${pluginName}`);
		try {
			fs.unlinkSync(pluginPath);
		} catch (error) {
			throw error;
		}
	}

	deleteSourcePlugin(pluginName) {
		if (!pluginName.includes("-plugin.js")) throw new Error("Plugin not found!");
		const pluginPath = path.join(__dirname, `../source-plugins/${pluginName}`);
		try {
			fs.unlinkSync(pluginPath);
		} catch (error) {
			throw error;
		}
	}
}

const pluginHandler = new PluginHandler();

export default pluginHandler;
