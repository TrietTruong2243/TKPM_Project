import express from "express";
import { engine } from "express-handlebars";
import Handlebars from "handlebars";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import downloaderRouter from "./routes/download.r.js";
import sourceRouter from "./routes/sources.r.js";
import categoryRouter from "./routes/categories.r.js";
import novelRouter from "./routes/novel.r.js";
import chapterRouter from "./routes/chapters.r.js";
import pluginRouter from "./routes/plugins.r.js";
import indexRouter from "./routes/index.r.js";

Handlebars.registerHelper("add", function(a, b) {
	return a + b;
});

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/:source/novels/:slug/chapters", chapterRouter);
app.use("/api/:source/novels", novelRouter);
app.use("/api/:source/categories", categoryRouter);
app.use("/api/:source/download", downloaderRouter);
app.use("/api/sources", sourceRouter);
app.use("/api/plugins", pluginRouter);
app.use("/", indexRouter);

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
