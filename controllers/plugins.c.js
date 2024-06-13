import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import NovelFetcher from "../services/novel-fetcher.js";
import DownloaderFetcher from "../services/downloader-fetcher.js";

// [POST] /api/plugins/sources/create
const addSourcePlugin = async (req, res) => {
	try {
		const pluginFile = req.file;

		// check if the file has valid name
		if (!pluginFile.originalname.includes("-plugin.js")) {
			res.status(400).json({
				status: "error",
				message: "Invalid file name",
			});
			return;
		}

		// extract the strategy name from the file name
		const strategy = pluginFile.originalname.split("-")[0];

		if (pluginFile) {
			const pluginPath = path.join(__dirname, `../source-plugins/${strategy}-plugin.js`);

			// check if the plugin file exists
			if (fs.existsSync(pluginPath)) {
				console.log(`Plugin ${strategy} already exists`);
				res.status(400).json({
					status: "error",
					message: `Plugin ${strategy} already exists`,
				});
				return;
			}

			// Write the file to disk
			fs.writeFileSync(pluginPath, pluginFile.buffer);

			// test the new plugin
			const testResult = await NovelFetcher.testPlugin(pluginPath);
			if (testResult) {
				await NovelFetcher.loadStrategyWithPath(pluginPath);
				res.status(200).json({
					status: "success",
					message: `Plugin ${strategy} was loaded successfully`,
				});
			} else {
				console.log(`Strategy ${strategy} failed the test and was not loaded.`);
				// delete the file in plugin folder
				fs.unlinkSync(pluginPath);
				res.status(400).json({
					status: "error",
					message: `Plugin ${strategy} failed the test and was not loaded`,
				});
			}
		}
	} catch (error) {
		res.status(500).json({
			status: "error",
			error: error.message,
		});
	}
};

// [POST] /api/plugins/sources/remove
const removeSourcePlugin = (req, res) => {
	const { pluginName } = req.body;

	if (pluginName) {
		const pluginPath = path.join(__dirname, `../source-plugins/${pluginName}-plugin.js`);

		if (fs.existsSync(pluginPath)) {
            NovelFetcher.removeStrategy(pluginName);
			fs.unlinkSync(pluginPath);
			res.json({ status: "success", message: `Source plugin ${pluginName} has been removed` });
			return;
		}

		res.json({ status: "error", message: `Source plugin ${pluginName} not found` });
	} else {
		res.json({ status: "error", message: `Plugin name is required` });
	}
};

// [POST] /api/plugins/downloaders/create
const addDownloaderPlugin = async (req, res) => {
	try {
		const pluginFile = req.file;

		// check if the file has valid name
		if (!pluginFile.originalname.includes("-downloader-plugin.js")) {
			res.status(400).json({
				status: "error",
				message: "Invalid file name",
			});
			return;
		}

		// extract the strategy name from the file name
		const strategy = pluginFile.originalname.split("-")[0];

		if (pluginFile) {
			const pluginPath = path.join(__dirname, `../download-plugins/${strategy}-downloader-plugin.js`);

			// check if the plugin file exists
			if (fs.existsSync(pluginPath)) {
				console.log(`Plugin ${strategy} already exists`);
				res.status(400).json({
					status: "error",
					message: `Plugin ${strategy} already exists`,
				});
				return;
			}

			// Write the file to disk
			fs.writeFileSync(pluginPath, pluginFile.buffer);

			await DownloaderFetcher.loadStrategyWithPath(pluginPath);
			res.status(200).json({
				status: "success",
				message: `Plugin ${strategy} was loaded successfully`,
			});
		}
	} catch (error) {
		res.status(500).json({
			status: "error",
			error: error.message,
		});
	}
};

// [POST] /api/plugins/downloaders/remove
const removeDownloaderPlugin = (req, res) => {
	const { pluginName } = req.body;

	if (pluginName) {
		const pluginPath = path.join(__dirname, `../download-plugins/${pluginName}-plugin.js`);

		if (fs.existsSync(pluginPath)) {
            DownloaderFetcher.removeStrategy(pluginName);
			fs.unlinkSync(pluginPath);
			res.json({ status: "success", message: `Downloader plugin ${pluginName} has been removed` });
			return;
		}

		res.json({ status: "error", message: `Downloader plugin ${pluginName} not found` });
	} else {
		res.json({ status: "error", message: `Plugin name is required` });
	}
};

export { addSourcePlugin, removeSourcePlugin, removeDownloaderPlugin, addDownloaderPlugin };