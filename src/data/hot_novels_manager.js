import getHotNovels from "../service/hot_novel_service";
import DataManagementInterface from "./data_management_interface";
import NovelSourceManager from "./novel_source_manager";

let instance;
class HotNovelManager extends DataManagementInterface{
    constructor(){
        if(instance){
            throw new Error('You can only create 1 instance!')
        }
        super();
        this.hot_novels=[];
        instance=this;
    }
    static getInstance(){
        if(instance){
            return instance;
        }
        return new HotNovelManager();
    }
    async get(){
        await this.reload();
        return this.hot_novels;
    }
    async set(params){
    }
    async save(){
    }
    async reload(){
        let source_manager=NovelSourceManager.getInstance();
        let sources=await source_manager.get();
        if (!sources || sources.length<=0){
            return;
        }
        let hot_novels=await getHotNovels(sources[0].slug);
        this.hot_novels=[...hot_novels];
    }
}
export default HotNovelManager;