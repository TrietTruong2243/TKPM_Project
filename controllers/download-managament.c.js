import downloaderFetcher from "../services/downloader-fetcher.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PassThrough } = require("stream");

const getSupportFileFormat = async (req, res) => {
	try {
		const formats = downloaderFetcher.getAvailableStrategies();
		res.status(200).json({
			message: "success",
			data: formats,
		});
	} catch (error) {
		res.status(500).json({
			message: "error",
			error: error.message,
		});
	}
};

const getFile = async (req, res) => {
	const { source, format, novelSlug, chapterSlug } = req.params;
	try {
		const content = await downloaderFetcher.fetchGetBuffer(format, source, novelSlug, chapterSlug);
		res.setHeader("Content-Type", content.blob.type);
		var stream = new PassThrough();
		stream.pipe(res);
		const arrayBuffer = await content.blob.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		stream.write(buffer);
		stream.end();
	} catch (error) {
		res.status(500).json({
			message: "error",
			error: error.message,
		});
	}
};

export { getFile, getSupportFileFormat };
