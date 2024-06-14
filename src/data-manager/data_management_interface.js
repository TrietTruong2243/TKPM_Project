
class DataManagementInterface{
    constructor(){

    }
    get(key){
        throw new Error('Missing implementation!!');
    }
    async set(params){
        throw new Error('Missing implementation!!');
    }
    async save(){
        throw new Error('Missing implementation!!');
    }
    async reload(){
        throw new Error('Missing implementation!!');
    }
}
export default DataManagementInterface;