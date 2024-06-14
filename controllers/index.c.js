import { novelFetcher, downloaderFetcher } from "../services/initialization.js";

// [GET] /
const showHome = async (req, res) => {
	try {
		const sourcePlugins = novelFetcher.getAvailableStrategies();
		const downloaderPlugins = downloaderFetcher.getAvailableStrategies();
		res.render("index", { sourcePlugins, downloaderPlugins });
	} catch (error) {
		res.status(500).json({
			status: "error",
			error: error.message,
		});
	}
};

export { showHome };
