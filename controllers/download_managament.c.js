import downloaderFetcher from "../services/downloader-fetcher.js";
import {createRequire} from "module"
const require = createRequire(import.meta.url);
const {PassThrough}=require("stream")
const getFile=async (req,res)=>{
    const {source,novel_slug,chapter_slug}=req.params;
    try {
        res.setHeader('Content-Type', 'application/pdf');
        const content=await downloaderFetcher.fetchGetBuffer('pdf-downloader',source,novel_slug,chapter_slug);
        var stream=new PassThrough();
        stream.pipe(res);
        const arrayBuffer = await content.blob.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
        stream.write(buffer);
        stream.end();        

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'error',
            error: error.message
        });
    }
}

export {getFile};