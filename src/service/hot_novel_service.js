import axios from "axios";
async function getHotNovels(source) {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${source}/novels/hot`)
        if (response.status===200){
            return response.data.data.hotNovels;
        }
        return [];
    } catch (error) {
        return [];
    }
}
export default getHotNovels;