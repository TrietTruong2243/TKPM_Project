import express from 'express';
import { getSources } from '../controllers/sources.c.js';

const router = express.Router();
router.get('/', getSources);

export default router;