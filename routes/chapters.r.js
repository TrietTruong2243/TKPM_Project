import express from 'express';
import { getNovelChapterList, getChapterContent } from '../controllers/chapters.c.js';

const router = express.Router({ mergeParams: true });
router.get('/', getNovelChapterList);
router.get('/:chapterId', getChapterContent);

export default router;