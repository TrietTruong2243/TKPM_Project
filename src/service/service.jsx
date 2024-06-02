import axios from 'axios';

export async function GetNovelByIdService(novelId) {
  try {
    const response = await axios.get(`http://localhost:4000/${novelId}`);
    const data = response.data.data;
    const resData = {
      novelId: novelId,
      img: 'https://via.placeholder.com/100',
      title: data.title,
      genres: data.genres,
      authors: data.authors,
      source: "truyenfull.vn",
      status: data.status,
      chapterCount: data.chapterCount,
      description: data.desc,
      chapterPerPage: data.chapterPerPage
    };
    return resData;
  } catch (error) {
    console.error('There was an error making the request!', error);
    throw error;
  }
}

export async function GetAllChapterByNovelId(novelId, chapterCount, chapterPerPage) {
  try {
    let chapterPromises = []
    const pageCounts = Math.ceil(chapterCount / chapterPerPage);
    for (let i = 1; i <= pageCounts; i++) {
      chapterPromises.push(axios.get(`http://localhost:4000/${novelId}/chapter-list/${i}`));
    }

    const responses = await Promise.all(chapterPromises);
    const allChapters = responses.flatMap(response => response.data.data);
    console.log(allChapters);
    return allChapters;
  } catch (error) {
    console.error('There was an error making the request!', error);
    throw error;
  }
}

export async function GetChapterOfNovelContent(novelId, chapterId) {
  try {
    const response = await axios.get(`http://localhost:4000/${novelId}/${chapterId}`);
    const data = response.data.data;
    data.novelId=  novelId;
    return data;
  } catch (error) {
    console.error('There was an error making the request!', error);
    throw error;
  }
}
export async function GetHotNovels() {
  try {
    const response = await axios.get(`http://localhost:4000/hot-stories/0`);
    const data = response.data.data;
    data.forEach(item => {
      item.novelId = item.kebabCaseTitle;
item.img ='https://fast.com.vn/uploads/news/He-thong-thong-tin/api-la-gi.jpg'    });
    return data;
  } catch (error) {
    console.error('There was an error making the request!', error);
    throw error;
  }
}