import axios from "axios";
import { source_data } from "../data/data";
import getAllCategories from "./categories_service";
function getNovelSource() {
    try {
      //const result = await axios.get(`${process.env.APP_BASE_URL}`)
      return source_data;
    } catch (error) {
      return source_data;
    }
}
export default getNovelSource;