import getAllCategories from "../service/categories_service";
import DataManagementInterface from "./data_management_interface";

let instance;
class CategoryManager extends DataManagementInterface{
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
    async get(){
        await this.reload();
        return this.categories_list;
    }
    async set(params){        
    }
    async save(){
    }
    async reload(){
        let categories_list=[]
        const source_list=['truyenfull','metruyenchu']
        for (let i in source_list){
            let current_source_categories= await getAllCategories(source_list[i]);
            categories_list=[...categories_list,...current_source_categories]
        }
        let result =[...new Map(categories_list.map(item =>[item["slug"], item])).values()]
        this.categories_list=result;
    }
}
export default CategoryManager;