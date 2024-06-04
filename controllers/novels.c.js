import NovelFetcher from '../services/novel-fetcher.js';

// [GET] /api/:source/novels/hot
const getHotNovels = async (req, res) => {
    const { source } = req.params;
    try {
        const hotNovels = await NovelFetcher.fetchHotNovels(source);
        res.status(200).json({
            message: 'success',
            data: hotNovels
        });

    } catch (error) {
        res.status(500).json({
            message: 'error',
            error: error.message
        });
    }
}


// [GET] /api/:source/novels/search?keyword=&page=1
const searchNovels = async (req, res) => {
    const { source } = req.params;
    const { keyword, page } = req.query;
    try {
        const novels = await NovelFetcher.fetchNovels(source, keyword, page);
        res.status(200).json({
            message: 'success',
            data: novels
        });

    } catch (error) {
        res.status(500).json({
            message: 'error',
            error: error.message
        });
    }
}

// [GET] /api/:source/novels/:slug
const getNovelBySlug = async (req, res) => {
    const { source, slug } = req.params;
    try {
        const novelInfo = await NovelFetcher.fetchNovelByTitle(source, slug);
        res.status(200).json({
            message: 'success',
            data: novelInfo
        });

    } catch (error) {
        res.status(500).json({
            message: 'error',
            error: error.message
        });
    }
}

export {
    getHotNovels,
    searchNovels,
    getNovelBySlug,
};