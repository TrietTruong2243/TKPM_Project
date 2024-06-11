import { GetAllChapterByNovelId, getNovelDescription,GetChapterOfNovelContent } from "../service/service";
import DataManagementInterface from "./data_management_interface";
import NovelSourceManager from "./novel_source_manager";

let instance;
class NovelDescriptionManager extends DataManagementInterface{
    constructor(){
        if(instance){
            throw new Error('You can only create 1 instance')
        }
        super();
        this.current_source='';
        this.novel_slug='';
        this.novel_info=null;
        this.available_source=[];
        instance=this;
    }
    static getInstance(){
        if(instance){
            return instance;
        }
        return new NovelDescriptionManager();
    }
    async get(){
        await this.reload();
        return this.novel_info;
    }
    async set(params){
        if(params.available_source){
            this.available_source=[...params.available_source]
        }
        if(params.novel_slug){
            this.novel_slug=params.novel_slug
        }
    }
    async save(){
    }
    async reload(){
        this.novel_info=null;
        const source_manager=NovelSourceManager.getInstance();
        const sources=await source_manager.get()
        for(let i in sources){
            const novel_info=await getNovelDescription(this.novel_slug,sources[i].slug);
            if(novel_info){
                if (this.current_source===''){
                    this.current_source=sources[i].slug;
                }
                if(this.novel_info===null){
                    this.novel_info=novel_info;
                }
                this.available_source.push(sources[i]);
            }
        }
        let result =[...new Map(this.available_source.map(item =>[item["slug"], item])).values()]
        this.available_source=[...result];
    }
    async getAllChapter(){
        if(this.current_source===''){
            return [];
        }
        return await GetAllChapterByNovelId(this.novel_slug,this.current_source).then(res=>{
            return res;
        });
    }
    async getChapterContent(chapter_slug){
        return await GetChapterOfNovelContent(this.novel_slug, chapter_slug, this.current_source).then((res)=>{
            return res;
        })
    }
}
export default NovelDescriptionManager;