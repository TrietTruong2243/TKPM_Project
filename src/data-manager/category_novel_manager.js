import DataManagementInterface from "./data_management_interface";
import NovelSourceManager from "./novel_source_manager";
import getNovelByCategory from "../service/category_novel_service";
let instance;
class NovelByCategoryManager extends DataManagementInterface{

    //constructor group
    constructor(){
        if(instance){
            throw new Error("You can only create one instance!");
        }
        super();
        this.category="";
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
        return new NovelByCategoryManager();
    }

    //override DataManagentInterface
    get(key){
        switch(key){
            case 'novels':{
                return this.novels;
            }
            case 'page':{
                return this.page;
            }
            default:{
                console.log(`Cannot find property ${key} in searching novel by category manager!`);
                return null;
            }
        }
    }
    async set(params){
        if (params.page){
            this.page=params.page;
        }
        if (params.category){
            this.category=params.category;
        }
    }
    async save(){
    }
    async reload(){
        await this.loadSource();
        await this.queryNovels();
    }

    //addition method
    async loadSource(){
        let source_manager=NovelSourceManager.getInstance();
        await source_manager.reload();
        let sources=source_manager.get('sources');

        this.sources=[]
        for (let i in sources){
            let source_meta=await getNovelByCategory(sources[i].slug,this.category,1);
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
        let novels=await getNovelByCategory(query_source,this.category,query_page);
        this.novels=[...novels.novels]; 
    }
}

export default NovelByCategoryManager;