import fs from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";
import chokidar from "chokidar";
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
		console.log(this.strategies);
	}

	async loadStrategyWithPath(pluginPath) {
		const pluginURL = pathToFileURL(pluginPath).href;
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
			};
		});
	}

	async fetchGetBuffer(strategyName, source, novel_slug, chapter_slug) {
		const strategy = this.strategies[strategyName];
		if (!strategy || !typeof strategy.getCategories === "function") {
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

	watchPlugins() {
		const watcher = chokidar.watch(path.join(__dirname, "../download-plugins"), { persistent: true });
		watcher
			.on("add", (pluginPath) => {
				console.log(`File ${pluginPath} has been added`);
				if (pluginPath.endsWith("plugin.js")) {
					this.loadStrategyWithPath(pluginPath);
				}
			})
			.on("change", (pluginPath) => {
				console.log(`File ${pluginPath} has been changed`);
				if (pluginPath.endsWith("plugin.js")) {
					this.loadStrategyWithPath(pluginPath);
				}
			})
			.on("unlink", (pluginPath) => {
				console.log(`File ${pluginPath} has been removed`);
				if (pluginPath.endsWith("plugin.js")) {
					const strategyName = path.basename(pluginPath, "-plugin.js");
					this.removeStrategy(strategyName);
				}
			});

		downloaderFetcher.loadStrategies(); // initial load
	}
}

const downloaderFetcher = new DownloaderFetcher();
downloaderFetcher.watchPlugins();

export default downloaderFetcher;
