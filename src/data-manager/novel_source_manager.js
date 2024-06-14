import getNovelSource from "../service/novel_source_service";
import DataManagementInterface from "./data_management_interface";
let instance;
class NovelSourceManager extends DataManagementInterface {
  //constructor group
  constructor() {
    if (instance) {
      throw new Error("You can only create one instance!");
    }
    super();
    this.source_list = [];
    instance = this;
  }
  static getInstance() {
    if (instance) {
      return instance;
    }
    return new NovelSourceManager();
  }

  //override DataManagementInterface
  get(key) {
    switch (key) {
      case "sources": {
        return this.source_list;
      }
      default: {
        console.log(`Cannot find property ${key} in source manager!`);
        return null;
      }
    }
  }
  async set(params) {
    this.source_list = [...params.sources];
  }
  async save() {
    localStorage.setItem("novel_source", JSON.stringify(this.source_list));
  }
  async reload() {
    let saved_source = JSON.parse(localStorage.getItem("novel_source")) || [];
    let server_source = await getNovelSource();
    let dot_array = Array(saved_source.length).fill(0);
    for (let s1 in server_source) {
      let is_existed = false;
      for (let s2 in saved_source) {
        if (server_source[s1].baseUrl === saved_source[s2].baseUrl) {
          is_existed = true;
          dot_array[s2] = 1;
          break;
        }
      }
      if (is_existed === false) {
        let addition_source = {
          id: saved_source.length + 1,
          slug: server_source[s1].slug,
          baseUrl: server_source[s1].baseUrl,
          name: server_source[s1].name,
        };
        saved_source = [...saved_source, addition_source];
      }
    }
    for (let i = dot_array.length - 1; i >= 0; i--) {
      if (dot_array[i] == 0) {
        saved_source.splice(i);
      }
    }
    for (let i = 0; i < saved_source.length; i++) {
      saved_source[i].id = i + 1;
    }
    this.source_list = [...saved_source];
  }

  //addition method
}
export default NovelSourceManager;
