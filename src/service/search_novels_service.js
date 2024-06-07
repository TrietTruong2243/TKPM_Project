import axios from "axios";
async function searchNovel(source,keyword, page) {
    try {
      const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${source}/novels/search?keyword=${keyword}&page=${page}`)
      if (result.status===200){
            return result.data.data.novels;
      }
      return [];
    } catch (error) {
      return [];
    }
}
export default searchNovel;