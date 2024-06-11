import getHotNovels from "../service/hot_novel_service";
import { getNovelDescription } from "../service/service";
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
            return [];
        }
        let hot_novels=await getHotNovels(sources[0].slug);
        this.hot_novels=[...new Map(hot_novels.map(item =>[item["slug"], item])).values()];
    }
    async getOtherSourceHotNovel(){
        let source_manager=NovelSourceManager.getInstance();
        let sources=await source_manager.get();
        if (!sources || sources.length<=1){
            return [];
        }
        let others_hot_novel=[];
        for(let i=1;i<sources.length;i++){
            let hot_novels=await getHotNovels(sources[i].slug);
            for(let j=0;j<hot_novels.length;j++){
                let novel_info=await getNovelDescription(hot_novels[j].slug,sources[i].slug);
                if(novel_info){
                    others_hot_novel.push({
                        slug:novel_info.slug,
                        title:novel_info.title,
                        authors:novel_info.authors,
                        categories:novel_info.categories,
                        num_chapters: novel_info.numChapters,
                        status:novel_info.status,
                    })
                }
            }
        }
        console.log(others_hot_novel)
        let result =[...new Map(others_hot_novel.map(item =>[item["slug"], item])).values()]
        console.log(result)
        return result;
    }
}
export default HotNovelManager;