import { getFile } from "../controllers/download_managament.c.js";
import express from "express";

const router = express.Router();
router.get("/:format/:novelSlug/:chapterSlug", getFile);

export default router;
