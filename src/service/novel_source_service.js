import axios from "axios";
async function getNovelSource() {
    try {
      const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/sources`)
      return result.data.data;
    } catch (error) {
      return [];
    }
}
export default getNovelSource;