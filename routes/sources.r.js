import express from "express";
import { getSources, getAlternativeNovels, getAlternativeChapter } from "../controllers/sources.c.js";

const router = express.Router();
router.get("/alternative-novels", getAlternativeNovels);
router.get("/alternative-chapter", getAlternativeChapter);
router.get("/", getSources);

export default router;
