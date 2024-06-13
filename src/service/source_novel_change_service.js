import axios from "axios";
async function getNovelChapterSourceChange(sourceSlug, novelSlug,chapterSlug,chapterTitle,chapterPosition) {
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/sources/alternative-chapter?targetSource=${sourceSlug}&targetNovelSlug=${novelSlug}&chapterSlug=${chapterSlug}&chapterTitle=${chapterTitle}&chapterPosition=${chapterPosition}`)
        console.log(result.data.data)
        return result.data.data;
    } catch (error) {
        return [];
    }
}
export default  getNovelChapterSourceChange;