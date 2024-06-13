import { getAllChapterByNovelId, getNovelDescription,getChapterOfNovelContent } from "../service/concrete_novel_service";
import DataManagementInterface from "./data_management_interface";
import NovelSourceManager from "./novel_source_manager";

let instance;
class NovelDescriptionManager extends DataManagementInterface{
    
    //constructor group
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

    //override DataManagementInterface
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
        const source_manager=NovelSourceManager.getInstance();
        const sources=await source_manager.get()
        let available_source=[];

        this.novel_info=null;
        for(let i in sources){
            const novel_info=await getNovelDescription(this.novel_slug,sources[i].slug);
            if(novel_info){
                if(this.novel_info===null){
                    this.novel_info=novel_info;
                    this.current_source=sources[i].slug;
                }
                available_source.push(sources[i]);
            }
        }

        let result =[...new Map(available_source.map(item =>[item["slug"], item])).values()]
        this.available_source=[...result];
    }

    //addition method
    async getAllChapter(){
        if(this.current_source===''){
            return [];
        }
        return await getAllChapterByNovelId(this.novel_slug,this.current_source).then(res=>{
           
            return res;
        });
    }
    async getChapterContent(chapter_slug){
        return await getChapterOfNovelContent(this.novel_slug, chapter_slug, this.current_source).then((res)=>{
            return res;
        })
    }
}
export default NovelDescriptionManager;