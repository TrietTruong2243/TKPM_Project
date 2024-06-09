import DownLoaderStrategy from "./download-plugin-interface.js";

class PDFDownloaderStrategy extends DownLoaderStrategy{
    constructor(){
        super('.pdf');
    }
    async getBuffer(source,novel_slug,chapter_slug){
    }
}
export default PDFDownloaderStrategy;