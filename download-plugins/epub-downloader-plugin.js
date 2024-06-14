import novelFetcher from "../services/novel-fetcher.js";
import DownLoaderStrategy from "./download-plugin-interface.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
var JSZip = require("jszip");

const getMimetype = () => {
	return "application/epub+zip";
};
const getContainer = () => {
	return (
		'<?xml version="1.0"?>' +
		'<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">' +
		"  <rootfiles>" +
		'    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" />' +
		"  </rootfiles>" +
		"</container>"
	);
};
const getMetaData = () => {
	return (
		'<?xml version="1.0"?>' +
		'<package version="3.0" xml:lang="en" xmlns="http://www.idpf.org/2007/opf" unique-identifier="book-id">' +
		'  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">' +
		'    <dc:identifier id="book-id">urn:uuid:B9B412F2-CAAD-4A44-B91F-A375068478A0</dc:identifier>' +
		'    <meta refines="#book-id" property="identifier-type" scheme="xsd:string">uuid</meta>' +
		'    <meta property="dcterms:modified">2000-03-24T00:00:00Z</meta>' +
		"    <dc:language>vi</dc:language>" +
		"    <dc:title>My Book</dc:title>" +
		"    <dc:creator>John Smith</dc:creator>" +
		"  </metadata>" +
		"  <manifest>" +
		'    <item id="text" href="text.xhtml" media-type="application/xhtml+xml"/>' +
		'    <item id="toc" href="../OEBPS/toc.ncx" media-type="application/x-dtbncx+xml"/>' +
		"  </manifest>" +
		'  <spine toc="toc">' +
		'    <itemref idref="text"/>' +
		"  </spine>" +
		"</package>"
	);
};
const getToc = (chapter) => {
	return (
		'<?xml version="1.0"?>' +
		'<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">' +
		"  <head>" +
		'    <meta name="dtb:uid" content="urn:uuid:B9B412F2-CAAD-4A44-B91F-A375068478A0"/>' +
		'    <meta name="dtb:depth" content="1"/>' +
		'    <meta name="dtb:totalPageCount" content="0"/>' +
		'    <meta name="dtb:maxPageNumber" content="0"/>' +
		"  </head>" +
		"  <docTitle>" +
		"    <text>My Book</text>" +
		"  </docTitle>" +
		"  <navMap>" +
		'    <navPoint id="navpoint-1" playOrder="1">' +
		"      <navLabel>" +
		`        <text>Chương ${chapter}</text>` +
		"      </navLabel>" +
		'      <content src="text.xhtml#xpointer(/html/body/section[1])"/>' +
		"    </navPoint>" +
		"  </navMap>" +
		"</ncx>"
	);
};
const getText = (title, content) => {
	return (
		'<?xml version="1.0" encoding="UTF-8" standalone="no"?>' +
		"<!DOCTYPE html>" +
		'<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="vi" lang="vi">' +
		"  <head>" +
		"    <title>My Book</title>" +
		"  </head>" +
		"  <body>" +
		`    <section>
                <h1 style="text-align: center;">${title}</h1>` +
		`       <p>${content}</p>` +
		"    </section>" +
		"  </body>" +
		"</html>"
	);
};
class EPUBDownloaderStrategy extends DownLoaderStrategy {
	constructor() {
		super(
			".epub",
			"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbU14J11CojjLhE-fVsmhAdSEQA68aeZygIlxkHLGqYXmla7_W8y_hMUnstS3UcZZwSso&usqp=CAU"
		);
	}
	async getBuffer(source, novel_slug, chapter_slug) {
		const response = await novelFetcher.fetchChapterContent(source, novel_slug, chapter_slug);
		const content = response.data.content;

		const title = response.data.title;
		const formattedContent = content
			.replace(/<p>/g, "<br/>")
			.replace(/<\/p>/g, "")
			.replace(/\n\n/g, "<br/>")
            .replace(/<em>/g,"")
            .replace(/<\/em>/g,"")
            .replace(/&nbsp;/g,"")
			.replace(/\t/g, "");

		let zip = new JSZip();
		zip.file("mimetype", getMimetype());
		zip.file("META-INF/container.xml", getContainer());
		zip.file("OEBPS/content.opf", getMetaData());
		zip.file("OEBPS/toc.ncx", getToc(chapter_slug));
		zip.file("OEBPS/text.xhtml", getText(title, formattedContent));
        console.log(formattedContent)
		return zip.generateAsync({ type: "blob", mimeType: "application/epub+zip" }).then((content) => {
			return content;
		});
	}
}
export default EPUBDownloaderStrategy;
