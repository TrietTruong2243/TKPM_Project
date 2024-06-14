import { getAllDownloadType,getNovelDownload } from "../service/download_service";
import DataManagementInterface from "./data_management_interface";

let instance;
class DownloadTypeManager extends DataManagementInterface{

    //constructor group
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

    //override DataManagementInterface
    get(key){
        switch(key){
            case 'support_types':{
                return this.download_types;
            }
            case 'file':{
                return this.downloadNovel(this.source_slug, 
                                          this.format_slug,
                                          this.novel_slug, 
                                          this.chapter_slug,
                                          this.novel_name, 
                                          this.chapter_name,
                                          this.extension);
            }
            default :{
                console.log(`Cannot find property ${key} in download manager!`);
                return null;
            }
        }
    }
    async set(params){
        this.source_slug = params.source_slug
        this.format_slug = params.format_slug
        this.novel_slug = params.novel_slug
        this.chapter_slug = params.chapter_slug
        this.novel_name = params.novel_name
        this.chapter_name = params.chapter_name
        this.extension = params.extension
    }
    async save(){
    }
    async reload(){
        if (this.source_slug === null){
            return;
        }
        let download_types=await getAllDownloadType(this.source_slug);
        this.download_types=[...download_types];
    }


    //addition method
    async downloadNovel(source_slug, format_slug,novel_slug, chapter_slug,novel_name, chapter_name,extension){
        let download = await getNovelDownload(source_slug,format_slug,novel_slug,chapter_slug,novel_name, chapter_name,extension);
        return download;            
    }
}
export default DownloadTypeManager