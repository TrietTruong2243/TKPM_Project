import express from "express";
import {
	addSourcePlugin,
	removeSourcePlugin,
	addDownloaderPlugin,
	removeDownloaderPlugin,
} from "../controllers/plugins.c.js";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import multer from "multer";
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(__dirname, '../source-plugins'));
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// });
const storage = multer.memoryStorage();

const router = express.Router();
const upload = multer({ storage: storage }).single("sourceFile");
const downloaderUpload = multer({ storage: storage }).single("downloaderFile");
router.post("/sources/create", upload, addSourcePlugin);
router.post("/sources/remove", removeSourcePlugin);
router.post("/downloaders/create", downloaderUpload, addDownloaderPlugin);
router.post("/downloaders/remove", removeDownloaderPlugin);

export default router;
