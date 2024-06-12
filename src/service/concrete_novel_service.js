import axios from 'axios';
async function getNovelDescription(novel_slug,source){
    try{
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${source}/novels/${novel_slug}`);
        const data = response.data.data.data;
        if (data.title === "") {
        return null;
        }
        return data;
    }
    catch(error)
    {
        return null;
    }
}

async function getChapterByPage(novel_id,source_slug,page){
    try{
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${source_slug}/novels/${novel_id}/chapters?page=${page}`);
        const data = response.data.data.data;
        return data;
    }
    catch(error)
    {
        return null;
    }
}

async function getAllChapterByNovelId(novel_id, source_slug) {
    try {
        const first_response = await getChapterByPage(novel_id,source_slug,1);
        const count_chapter_data = first_response.meta.total_pages;
        const chapter_promises = Array.from({ length: count_chapter_data }, (_, index) =>
                                                                                getChapterByPage(novel_id,source_slug,index+1)
                                                                            );
        const responses = await Promise.all(chapter_promises);
        const all_chapters = responses.flatMap(response => response!=null?response.chapters:[]);
        return all_chapters;
    } catch (error) {
        return [];
    }
}

async function getChapterOfNovelContent(novel_id, chapter_id,source_slug) {
    try {

        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${source_slug}/novels/${novel_id}/chapters/${chapter_id}`);
        const data = response.data.data.data;
        data.novelId = novel_id;
        return data;
    } catch (error) {
        console.error('There was an error making the request!', error);
    }
}
export {getNovelDescription,getChapterByPage,getAllChapterByNovelId,getChapterOfNovelContent};