import axios from 'axios';
export async function getNovelDescription(novel_slug,source){
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

export async function getChapterByPage(novelId,sourceSlug,page){
  try{
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${sourceSlug}/novels/${novelId}/chapters?page=${page}`);
    const data = response.data.data.data;
    return data;
  }
  catch(error)
  {
    return null;
  }
}

export async function GetAllChapterByNovelId(novelId, sourceSlug) {
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

export async function GetChapterOfNovelContent(novelId, chapterId,sourceSlug) {
  try {

    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${sourceSlug}/novels/${novelId}/chapters/${chapterId}`);
    const data = response.data.data.data;
    data.novelId = novelId;
    return data;
  } catch (error) {
    console.error('There was an error making the request!', error);
  }
}