import { getFile, getSupportFileFormat } from "../controllers/download_managament.c.js";
import express from "express";

const router = express.Router({mergeParams:true});
router.get("/:format/:novelSlug/:chapterSlug", getFile);
router.get("/",getSupportFileFormat);
export default router;
