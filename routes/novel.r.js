import express from 'express';
import { getHotNovels, getNovelBySlug, searchNovels } from '../controllers/novels.c.js';

const router = express.Router({ mergeParams: true });
router.get('/hot', getHotNovels);
router.get('/search', searchNovels);
router.get('/:slug', getNovelBySlug);

export default router;