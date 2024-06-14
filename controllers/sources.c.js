import { novelFetcher } from '../services/initialization.js';

// [GET] /api/sources
const getSources = async (req, res) => {
    try {
        const sources = novelFetcher.getAvailableStrategies();
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

// [GET] /api/sources/alternative-novels?source=_&slug=_&title=_
const getAlternativeNovels = async (req, res) => {
    const { source, slug, title } = req.query;
    try {
        // if one of the parameters is missing, throw an error
        if (!source || !slug || !title) {
            throw new Error('Missing parameters');
        }

        const alternatives = await novelFetcher.fetchAlternativeNovels(source, slug, title);
        res.status(200).json({
            message: 'success',
            data: alternatives
        });

    } catch (error) {
        res.status(500).json({
            message: 'error',
            error: error.message
        });
    }
}

// [GET] /api/sources/alternative-chapters?targetSource=_&targetNovelSlug=_&chapterSlug=_&chapterTitle=_&chapterPosition=_
const getAlternativeChapter = async (req, res) => {
    const { targetSource, targetNovelSlug, chapterSlug, chapterTitle, chapterPosition } = req.query;
    try {
        // if one of the parameters is missing, throw an error
        if (!targetSource || !targetNovelSlug || !chapterSlug || !chapterTitle || !chapterPosition) {
            throw new Error('Missing parameters');
        }

        const alternatives = await novelFetcher.fetchAlternativeChapter(targetSource, targetNovelSlug, chapterSlug, chapterTitle, chapterPosition);
        res.status(200).json({
            message: 'success',
            data: alternatives
        });

    } catch (error) {
        res.status(500).json({
            message: 'error',
            error: error.message
        });
    }
}

export { getSources, getAlternativeNovels, getAlternativeChapter };