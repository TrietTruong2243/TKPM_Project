import NovelFetcher from "../services/novel-fetcher.js";
import DownloaderFetcher from "../services/downloader-fetcher.js";

// [GET] /
const showHome = async (req, res) => {
    try {
        const sourcePlugins = NovelFetcher.getAvailableStrategies();
        const downloaderPlugins = DownloaderFetcher.getAvailableStrategies();
        res.render('index', { sourcePlugins, downloaderPlugins });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
}


export {
    showHome,
}
