import NovelFetcher from '../services/novel-fetcher.js';

// [GET] /api/:source/categories
const getCategories = async (req, res) => {
    const { source } = req.params;
    try {
        const categories = await NovelFetcher.fetchCategories(source);
        res.status(200).json({
            message: 'success',
            data: categories
        });

    } catch (error) {
        res.status(500).json({
            message: 'error',
            error: error.message
        });
    }
}

export { getCategories };