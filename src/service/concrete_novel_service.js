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

async function getChapterByPage(novelId,sourceSlug,page){
    try{
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${sourceSlug}/novels/${novelId}/chapters?page=${page}`);
        const data = response.data.data.data;
        console.log(data)
        return data;
    }
    catch(error)
    {
        return null;
    }
}
async function getMetaChapterByNovel(novelId,sourceSlug){
    try{
        console.log(novelId, sourceSlug)
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${sourceSlug}/novels/${novelId}/chapters?page=${1}`);
        console.log(response)
        const data = response.data.data.data.meta;
        console.log(data)
        return data;
    }
    catch(error)
    {
        console.log(error)
        return null;
    }
}
async function getAllChapterByNovelId(novelId, sourceSlug) {
    try {
        const first_response = await getChapterByPage(novelId,sourceSlug,1);
        const count_chapter_data = first_response.meta.total_pages;
        const chapterPromises = Array.from({ length: count_chapter_data }, (_, index) =>
        getChapterByPage(novelId,sourceSlug,index+1)
        );
        const responses = await Promise.all(chapterPromises);
        const allChapters = responses.flatMap(response => response!=null?response.chapters:[]);
        return allChapters;
    } catch (error) {
        return [];
    }
}

async function getChapterOfNovelContent(novelId, chapterId,sourceSlug) {
    try {

        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${sourceSlug}/novels/${novelId}/chapters/${chapterId}`);
        const data = response.data.data.data;
        data.novelId = novelId;
        return data;
    } catch (error) {
        console.error('There was an error making the request!', error);
        return null
    }
}
export {getNovelDescription,getChapterByPage,getAllChapterByNovelId,getChapterOfNovelContent,getMetaChapterByNovel};