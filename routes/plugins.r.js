import express from "express";
import { deleteDownloadPlugin } from "../controllers/plugins.c.js";

const router = express.Router();
router.post("/delete/:pluginType", deleteDownloadPlugin);

export default router;
