import PluginHandler from "../services/plugin-handler.js";

// [POST] /api/plugins/delete/:pluginType?pluginName=_
const deleteDownloadPlugin = (req, res) => {
	try {
		const { pluginType } = req.params;
		const pluginName = req.query.pluginName;

		if (pluginType === "download") {
			PluginHandler.deleteDownloadPlugin(pluginName);
		} else if (pluginType === "source") {
			PluginHandler.deleteSourcePlugin(pluginName);
		} else {
			throw new Error("Invalid plugin type!");
		}

		res.status(200).json({
			message: "success",
		});
	} catch (error) {
		res.status(500).json({
			message: "error",
			error: error.message,
		});
	}
};

export { deleteDownloadPlugin };
