import express from "express";
import { getCategories, getNovelsByCategory } from "../controllers/categories.c.js";

const router = express.Router({ mergeParams: true });
router.get("/:categorySlug", getNovelsByCategory);
router.get("/", getCategories);

export default router;
