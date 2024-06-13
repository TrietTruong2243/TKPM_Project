import fs from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";
import DownLoaderStrategy from "../download-plugins/download-plugin-interface.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DownloaderFetcher {
	constructor() {
		this.strategies = {};
	}

	async loadStrategies() {
		const pluginsPath = path.join(__dirname, "../download-plugins");
		const pluginFiles = fs.readdirSync(pluginsPath);
		this.strategies = {};

		for (const file of pluginFiles) {
			if (file.endsWith("plugin.js")) {
				const pluginPath = path.join(pluginsPath, file);
				await this.loadStrategyWithPath(pluginPath);
			}
		}
	}

	async loadStrategyWithPath(pluginPath) {
		let pluginURL = pathToFileURL(pluginPath).href;
		pluginURL = `${pluginURL}?update=${Date.now()}`;
		try {
			const { default: StrategyClass } = await import(pluginURL);
			if (StrategyClass.prototype instanceof DownLoaderStrategy) {
				const name = path.basename(pluginPath, "-plugin.js");
				this.strategies[name] = new StrategyClass();
				console.log(`Strategy '${name}' loaded successfully.`);
			} else {
				console.warn(`Strategy in '${pluginPath}' does not extend DownloaderStrategy and was not loaded.`);
			}
		} catch (error) {
			console.error(`Failed to load strategy from '${pluginPath}':`, error);
		}
	}

	removeStrategy(strategyName) {
		if (this.strategies[strategyName]) {
			delete this.strategies[strategyName];
			console.log(`Strategy '${strategyName}' has been removed.`);
		}
	}

	getAvailableStrategies() {
		return Object.keys(this.strategies).map((strategyName) => {
			return {
				slug: strategyName,
				extension: this.strategies[strategyName].extension,
				image: this.strategies[strategyName].image,
			};
		});
	}

	async fetchGetBuffer(strategyName, source, novel_slug, chapter_slug) {
		const strategy = this.strategies[strategyName];
		if (!strategy || typeof strategy.getBuffer != "function") {
			throw new Error(`Strategy '${strategyName}' not found.`);
		}
		try {
			const blob = await strategy.getBuffer(source, novel_slug, chapter_slug);
			return {
				blob,
			};
		} catch (error) {
			throw error;
		}
	}

}

const downloaderFetcher = new DownloaderFetcher();
await downloaderFetcher.loadStrategies();

export default downloaderFetcher;
