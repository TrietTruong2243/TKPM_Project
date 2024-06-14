import { novelFetcher } from '../services/initialization.js';

// [GET] /api/:source/categories
const getCategories = async (req, res) => {
    const { source } = req.params;
    try {
        const categories = await novelFetcher.fetchCategories(source);
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

// [GET] /api/:source/categories/:categorySlug
const getNovelsByCategory = async (req, res) => {
    const { source, categorySlug } = req.params;
    const page = req.query.page || 1;
    try {
        const novels = await novelFetcher.fetchNovelsByCategory(source, categorySlug, page);
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

export { getCategories, getNovelsByCategory };