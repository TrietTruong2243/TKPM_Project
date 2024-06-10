import novelFetcher from "../services/novel-fetcher.js";
import DownLoaderStrategy from "./download-plugin-interface.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const PDFDocument = require("pdfkit");
var blobStream = require("blob-stream");

class PDFDownloaderStrategy extends DownLoaderStrategy {
	constructor() {
		super(".pdf");
	}
	createPDF(source, novel_slug, chapter_slug) {
		return new Promise(async (resolve, reject) => {
			try {
				const doc = new PDFDocument();
				const stream = doc.pipe(blobStream());

				doc.font("./utils/fonts/arial.ttf");
				const response = await novelFetcher.fetchChapterContent(source, novel_slug, chapter_slug);
				const title = response.data.title;
				const content = response.data.content;
				const formattedContent = content
					.replace(/<p>/g, "<br/>")
					.replace(/<\/p>/g, "")
					.replace(/\n\n/g, "<br/>")
					.replace(/\t/g, "");

				// Split content into paragraphs
				const paragraphs = formattedContent.split("<br/>");

				doc.font("./utils/fonts/arial.ttf")
					.fontSize(10)
					.text("Nguồn: WeNovel", { align: "right", oblique: true })
					.moveDown();
				doc.font("./utils/fonts/arial-bold.ttf").fontSize(18).text(title, { align: "center" }).moveDown;
				doc.font("./utils/fonts/arial.ttf").fontSize(12);
				doc.moveDown();

				// Add paragraphs to PDF
				paragraphs.forEach((paragraph) => {
					const lines = paragraph.split("<br/>");
					lines.forEach((line) => {
						doc.text(line);
					});
					doc.moveDown();
				});

				doc.end();
				stream.on("finish", () => {
					const blob = stream.toBlob("application/pdf");
					resolve(blob);
				});

				stream.on("error", (err) => {
					reject(err);
				});
			} catch (error) {
				reject(error);
			}
		});
	}
	async getBuffer(source, novel_slug, chapter_slug) {
		return await this.createPDF(source, novel_slug, chapter_slug).then((blob) => {
			return blob;
		});
	}
}
export default PDFDownloaderStrategy;
