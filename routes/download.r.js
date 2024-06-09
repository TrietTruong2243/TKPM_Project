import { getFile } from "../controllers/download_managament.c.js";
import express from 'express';
const router = express.Router();
router.get('/', getFile);

export default router;