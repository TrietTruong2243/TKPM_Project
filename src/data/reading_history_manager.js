import DataManagementInterface from "./data_management_interface";
let instance;
class ReadingHistoryManager extends DataManagementInterface{
    constructor(){
        if(instance){
            throw new Error('You can only create 1 instance!!')
        }
        super();
        instance=this;
    }
    static getInstance(){
        if(instance){
            return instance;
        }
        return new ReadingHistoryManager();
    }
    async get(){
    }
    async set(params){
    }
    async save(){
    }
    async reload(){
        throw new Error('Missing implementation!!');
    }
    async saveNewReadingNovel(novel_slug,chapter_slug,source_slug,novel_info,chapter_content){    
        try{
            const readItems = JSON.parse(localStorage.getItem('readItems')) || {};
            if (readItems[novel_slug]) {
                delete readItems[novel_slug]
            }
            console.log(novel_slug,chapter_slug,source_slug,novel_info,chapter_content)
            readItems[novel_slug] = {
                novelImage: novel_info.image,
                novelTitle: novel_info.title, 
                sourceSlug: source_slug, 
                novelStatus: novel_info.status, 
                chapterId: chapter_slug, 
                chapterTitle: chapter_content.title
            };
            localStorage.setItem('readItems', JSON.stringify(readItems));
    }catch(error){

    }
    }
}

export default ReadingHistoryManager;