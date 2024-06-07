import searchNovel from "../service/search_novels_service";
import DataManagementInterface from "./data_management_interface";
import NovelSourceManager from "./novel_source_manager";
let instance;
class SearchingNovelsManager extends DataManagementInterface{
    constructor(){
        if(instance){
            throw new Error("You can only create one instance!");
        }
        super();
        this.keyword="";
        this.page=1;
        this.sources=[];
        this.novels=[];
        this.total_page=0;
        this.per_page=24;
        instance=this;
    }
    static getInstance(){
        if (instance){
            return instance;
        }
        return new SearchingNovelsManager();
    }
    async get(){
        await this.reload();
        return this.novels;
    }
    async set(params){
        if (params.page){
            this.page=params.page;
        }
        if (params.keyword){
            this.keyword=params.keyword;
        }
    }
    async save(){
    }
    async reload(){
        await this.loadSource();
        await this.queryNovels();
    }
    async loadSource(){
        this.total=0;
        let source_manager=NovelSourceManager.getInstance();
        let sources=await source_manager.get();
        for (let i in sources){
            let source_meta=await searchNovel(sources[i].slug,this.keyword,1);
            if(source_meta.meta){
                this.sources.push({slug:sources[i].slug,total:source_meta.meta.total,per_page:source_meta.meta.per_page})
                this.total+=source_meta.meta.total;
            }            
        }
        this.total_page=Math.ceil(this.total/this.per_page);
    }
    async queryNovels(){
        let searched_novels=await searchNovel(this.sources[0].slug,this.keyword,this.page);
        this.novels=[...searched_novels.novels];
    }
}

export default SearchingNovelsManager;