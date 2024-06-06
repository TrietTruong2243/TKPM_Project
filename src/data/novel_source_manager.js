import getNovelSource from "../service/novel_source_service";
let instance;
class NovelSourceManager{
    constructor(){
        if(instance){
            throw new Error("You can only create one instance!");
        }
        instance=this;
    }
    static getInstance(){
        if(instance){
            return instance;
        }
        return new NovelSourceManager();
    }
    getSource(){
        let saved_source=JSON.parse(localStorage.getItem('novel_source'))||[];
        let server_source=getNovelSource();
        let dot_array=Array(saved_source.length).fill(0);
        for(let s1 in server_source){
            let is_existed=false;
            for(let s2 in saved_source){
                if (server_source[s1].sourcepath === saved_source[s2].sourcepath){
                    is_existed=true;
                    dot_array[s2]=1;
                    break;
                }
            }
            if (is_existed===false){
                let addition_source={id:saved_source.length+1,sourcepath:server_source[s1].sourcepath,sourcename:server_source[s1].sourcename}
                saved_source=[...saved_source,addition_source]
            }            
        }
        for (let i=dot_array.length-1;i>=0;i--){
            if(dot_array[i]==0){
                saved_source.splice(i);
            }
        }
        for (let i=0;i<saved_source.length;i++){
            saved_source[i].id=i+1;
        }
        return saved_source;
    }
    saveSourceWithPriority(source_list){
        localStorage.setItem('novel_source',JSON.stringify(source_list))
    }

}
export default NovelSourceManager;
