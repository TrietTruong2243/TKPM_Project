import DataManagementInterface from "./data_management_interface";
let instance;
class ReadingHistoryManager extends DataManagementInterface{

    //constructor group
    constructor(){
        if(instance){
            throw new Error('You can only create 1 instance!!')
        }
        super();
        this.readItems=[];
        instance=this;
    }
    static getInstance(){
        if(instance){
            return instance;
        }
        return new ReadingHistoryManager();
    }

    //override DataManagementInterface
    get(key){
        switch(key){
            case 'readItems':{
                return this.readItems;
            }
            default:{
                console.log(`Cannot find property ${key} in reading history manager!`);
                return null;
            }
        }
    }
    async set(params){
    }
    async save(){
    }
    async reload(){
        this.readItems=JSON.parse(localStorage.getItem('readItems')) || {};
    }
    async saveNewReadingNovel(novel_slug,chapter_slug,chapterPosition,source_slug,novel_info,chapter_content){    
        try{
            const readItems = JSON.parse(localStorage.getItem('readItems')) || {};
            if (readItems[novel_slug]) {
                delete readItems[novel_slug]
            }
            readItems[novel_slug] = {
                novelImage: novel_info.image,
                novelTitle: novel_info.title, 
                sourceSlug: source_slug, 
                novelStatus: novel_info.status, 
                chapterId: chapter_slug, 
                chapterTitle: chapter_content.title,
                chapterPosition: chapterPosition
            };
            localStorage.setItem('readItems', JSON.stringify(readItems));
        }catch(error){

        }
    }
}

export default ReadingHistoryManager;