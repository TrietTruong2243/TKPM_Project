import searchNovel from "../service/search_novels_service";
import DataManagementInterface from "./data_management_interface";
import NovelSourceManager from "./novel_source_manager";
let instance;
class SearchingNovelsManager extends DataManagementInterface{

    //constructor group
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
        instance=this;
    }
    static getInstance(){
        if (instance){
            return instance;
        }
        return new SearchingNovelsManager();
    }

    //override DataManagementInterface
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

    //addition methods
    async loadSource(){
        this.sources=[]
        let source_manager=NovelSourceManager.getInstance();
        let sources=await source_manager.get();

        for (let i in sources){
            let source_meta=await searchNovel(sources[i].slug,this.keyword,1);
            if(source_meta.meta){                
                this.sources.push({slug:sources[i].slug,total_page:source_meta.meta.total_pages})
            }            
        }

        let result =[...new Map(this.sources.map(item =>[item["slug"], item])).values()]
        this.sources=[...result]
        this.total_page=this.sources.map(item => item.total_page).reduce((prev, curr) => prev + curr, 0);
    }
    async queryNovels(){
        let query_page=0;
        let query_source;

        this.page=this.page>this.total_page?this.total_page:this.page;
        for (let i in this.sources){
            if (query_page+this.sources[i].total_page>=this.page){
                query_source=this.sources[i].slug;
                break;
            }
            query_page+=this.sources[i].total_page;  
        }

        query_page=this.page-query_page;
        query_page=query_page<0?1:query_page;
        if (!query_source){
            if(!this.sources||this.sources.length<=0){
                this.novels=[]
                return;
            }else{
                let index=this.sources.length-1;
                query_page=this.sources[index].total_page;
                query_source=this.sources[index].slug;
            }
        }
        
        let novels=await searchNovel(query_source,this.keyword,query_page);
        this.novels=[...novels.novels]; 
    }
}

export default SearchingNovelsManager;