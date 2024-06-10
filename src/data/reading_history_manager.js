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
    async get(){
    }
    async set(params){
    }
    async save(){
        const readItems = JSON.parse(localStorage.getItem('readItems')) || {};
          if (readItems[novelId]) {
            delete readItems[novelId]
          }
          readItems[novelId] = chapterId;
          localStorage.setItem('readItems', JSON.stringify(readItems));
    }
    async reload(){
        throw new Error('Missing implementation!!');
    }
}

export default ReadingHistoryManager;