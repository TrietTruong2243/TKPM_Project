import getAllCategories from "../service/categories_service";
import DataManagementInterface from "./data_management_interface";
import NovelSourceManager from "./novel_source_manager";

let instance;
class CategoryManager extends DataManagementInterface{

    //constructor group
    constructor(){
        if(instance){
            throw new Error("You can only create one instance!");
        }
        super();
        this.categories_list=[];
        instance=this;
    }
    static getInstance(){
        if(instance){
            return instance;
        }
        return new CategoryManager();
    }


    //override DataManagementInterface
    async get(){
        await this.reload();
        return this.categories_list;
    }
    async set(params){        
    }
    async save(){
    }
    async reload(){
        let source_manager=NovelSourceManager.getInstance();
        let categories_list=[]
        const source_list=await source_manager.get();
        for (let i in source_list){
            let current_source_categories= await getAllCategories(source_list[i].slug);
            categories_list=[...categories_list,...current_source_categories]
        }
        let result =[...new Map(categories_list.map(item =>[item["slug"], item])).values()]
        this.categories_list=result;
    }

    //addition method
}
export default CategoryManager;