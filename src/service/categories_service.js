import axios from "axios";

async function getAllCategories(source) {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/${source}/categories`
    );
    return response.data.data.data;
  } catch (error) {
    return [];
  }
}
export default getAllCategories;
