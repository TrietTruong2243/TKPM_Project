import express from "express";
import {
	addSourcePlugin,
	removeSourcePlugin,
	addDownloaderPlugin,
	removeDownloaderPlugin,
} from "../controllers/plugins.c.js";

import multer from "multer";
const storage = multer.memoryStorage();

const router = express.Router();
const sourceUpload = multer({ storage: storage }).single("sourceFile");
const downloaderUpload = multer({ storage: storage }).single("downloaderFile");
router.post("/sources/create", sourceUpload, addSourcePlugin);
router.post("/sources/remove", removeSourcePlugin);
router.post("/downloaders/create", downloaderUpload, addDownloaderPlugin);
router.post("/downloaders/remove", removeDownloaderPlugin);

export default router;