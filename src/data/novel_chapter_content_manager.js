import DataManagementInterface from "./data_management_interface";
let instance;
class NovelChapterContentManager extends DataManagementInterface{
    constructor(){
        if(instance){
            throw new Error('You can only create 1 instance')
        }
        super();
        this.novel_slug='';
        this.novel_chapter='';
        this.current_source='';
        this.available_sources='';
        instance=this;
    }
    async get(){
    }
    async set(params){
    }
    async save(){
    }
    async reload(){
    }
}
export default NovelChapterContentManager;