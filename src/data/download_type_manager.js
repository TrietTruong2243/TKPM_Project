import { getAllDownloadType,getNovelDownload } from "../service/download_service";
import DataManagementInterface from "./data_management_interface";

let instance;
class DownloadTypeManager extends DataManagementInterface{
    constructor(){
        if(instance){
            throw new Error('You can only create 1 instance!')
        }
        super();
        this.source_slug = null;
        this.download_types=[];
        instance=this;
    }
    static getInstance(){
        if(instance){
            return instance;
        }
        return new DownloadTypeManager();
    }
    async get(){
        await this.reload();
        return this.download_types;
    }
    async set(params){
        this.source_slug = params.source_slug
    }
    async save(){
    }
    async reload(){
        if (this.source_slug === null){
            return;
        }
        let download_types=await getAllDownloadType(this.source_slug);
        this.download_types=[...download_types];
        alert(download_types)
    }
    async downloadNovel(source_slug, format_slug,novel_slug, chapter_slug,novel_name, chapter_name,extension){
        let download = await getNovelDownload(source_slug,format_slug,novel_slug,chapter_slug,novel_name, chapter_name,extension);
        return download;            
    }
}
export default DownloadTypeManager