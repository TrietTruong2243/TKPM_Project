import NovelFetcher from '../services/novel-fetcher.js';

// [GET] /api/sources
const getSources = async (req, res) => {
    try {
        const sources = NovelFetcher.getAvailableStrategies();
        res.status(200).json({
            message: 'success',
            data: sources
        });

    } catch (error) {
        res.status(500).json({
            message: 'error',
            error: error.message
        });
    }
}

export { getSources };