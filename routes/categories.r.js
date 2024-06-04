import express from 'express';
import { getCategories } from '../controllers/categories.c.js';

const router = express.Router({ mergeParams: true });
router.get('/', getCategories);

export default router;