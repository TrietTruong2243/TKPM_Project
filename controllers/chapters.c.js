import NovelFetcher from '../services/novel-fetcher.js';

// [GET] /api/:source/novels/:slug/chapters?page=1
const getNovelChapterList = async (req, res) => {
    const { source, slug } = req.params;
    const page = req.query.page || 1;
    try {
        const chapters = await NovelFetcher.fetchNovelChapterList(source, slug, page);
        res.status(200).json({
            message: 'success',
            data: chapters
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

// [GET] /api/:source/novels/:slug/chapters/:chapterId
const getChapterContent = async (req, res) => {
    const { source, slug, chapterId } = req.params;
    try {
        const chapterContent = await NovelFetcher.fetchChapterContent(source, slug, chapterId);
        res.status(200).json({
            message: 'success',
            data: chapterContent
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

export {
    getNovelChapterList,
    getChapterContent
};