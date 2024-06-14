import express from 'express';
import { showHome } from '../controllers/index.c.js';

const router = express.Router();
router.get('/', showHome);

export default router;