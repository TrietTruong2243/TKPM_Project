import getHotNovels from "../service/hot_novel_service";
import { getNovelDescription } from "../service/concrete_novel_service";
import DataManagementInterface from "./data_management_interface";
import NovelSourceManager from "./novel_source_manager";

let instance;
class HotNovelManager extends DataManagementInterface{
    
    //constructor group
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

    //override DataManagementInterface
    get(key){
        switch(key){
            case 'hot_novels':{
                return this.hot_novels;
            }
            case 'others_hot_novels':{
                return this.getOtherSourceHotNovel();
            }
            default :{
                console.log(`Cannot find property ${key} in category manager!`);
                return null;
            }
        }
    }
    async set(params){
    }
    async save(){
    }
    async reload(){
        let source_manager=NovelSourceManager.getInstance();
        await source_manager.reload();
        let sources=source_manager.get('sources');

        if (!sources || sources.length<=0){
            return [];
        }

        let hot_novels=await getHotNovels(sources[0].slug);
        this.hot_novels=[...new Map(hot_novels.map(item =>[item["slug"], item])).values()];
    }


    //addition method
    async getOtherSourceHotNovel(){
        let source_manager=NovelSourceManager.getInstance();
        await source_manager.reload();
        let sources=source_manager.get('sources');

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

        let result =[...new Map(others_hot_novel.map(item =>[item["slug"], item])).values()]
        return result;
    }
}
export default HotNovelManager;