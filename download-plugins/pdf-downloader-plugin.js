import DownLoaderStrategy from "./download-plugin-interface.js";
import {createRequire} from "module"
const require = createRequire(import.meta.url);
var PDFDocument=require("pdfkit")
var blobStream = require('blob-stream');
class PDFDownloaderStrategy extends DownLoaderStrategy{
    constructor(){
        super('.pdf');
    }
    createPDF() {
        return new Promise((resolve, reject) => {
            // Khởi tạo tài liệu PDF
            const doc = new PDFDocument();
    
            // Khởi tạo một stream để chuyển đổi thành Blob
            const stream = doc.pipe(blobStream());
    
            // Thêm nội dung vào tài liệu PDF
            const lorem = `Phạm Vũ Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;
            // the following line is the one you're looking for
          
            // draw some text
            doc.fontSize(25).text('Here is some vector graphics...', 100, 80);
          
            // some vector graphics
            doc.save()
              .moveTo(100, 150)
              .lineTo(100, 250)
              .lineTo(200, 250)
              .fill('#FF3300');
          
            doc.circle(280, 200, 50).fill('#6600FF');
          
            // an SVG path
            doc.scale(0.6)
              .translate(470, 130)
              .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
              .fill('red', 'even-odd')
              .restore();
          
            // and some justified text wrapped into columns
            doc.text('And here is some wrapped text...', 100, 300)
              .font('Times-Roman', 13)
              .moveDown()
              .text(lorem, {
                width: 412,
                align: 'justify',
                indent: 30,
                columns: 2,
                height: 300,
                ellipsis: true,
              });
          
            doc.end();
            // Lắng nghe sự kiện 'finish' để lấy Blob khi kết thúc
            stream.on('finish', function() {
                try {
                    let blob = stream.toBlob('application/pdf');
                    resolve(blob);
                } catch (error) {
                    reject(error);
                }
            });
    
            // Xử lý lỗi
            stream.on('error', function(err) {
                reject(err);
            });
        });
    }
    async getBuffer(source,novel_slug,chapter_slug){
        return await this.createPDF().then((blob)=>{
            return blob;
        })
    }
}
export default PDFDownloaderStrategy;