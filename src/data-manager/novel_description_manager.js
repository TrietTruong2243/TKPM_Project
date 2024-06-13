import { getAllChapterByNovelId, getNovelDescription,getChapterOfNovelContent,getChapterByPage,getMetaChapterByNovel } from "../service/concrete_novel_service";
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

        this.novel_info=null;
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
            if (res===null){
                return null
            }
            return res;
        })
    }
    async getChaptersByPage( page)
    {
        return await getChapterByPage(this.novel_slug,this.current_source, page).then((res)=>{
            console.log(res)
            if (res===null){
                return null
            }
            return res.chapters;
        })
    }
    async getMetaChapterByNovel()
    {
        return await getMetaChapterByNovel(this.novel_slug,this.current_source).then((res)=>{
            if (res===null){
                return null
            }
            return res;
        })
    }
    async setSource(source){
this.current_source = source
    this.novel_info=await getNovelDescription(this.novel_slug,this.current_source);
   

    }
}
export default NovelDescriptionManager;