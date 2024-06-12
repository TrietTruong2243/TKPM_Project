import axios from "axios";
async function getNovelByCategory(source,category,page) {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${source}/categories/${category}?page=${page}`)
        if (response.status===200){
            return response.data.data.data;
        }
        return [];
    } catch (error) {
        return [];
    }
}
export default getNovelByCategory;