import axios from 'axios';

export async function GetNovelByIdService(novelId, sourceList) {
  try {
    let check = false;
    let availableSource = [];
    let checkResData;
    for (let i = 0; i < sourceList.length; i++) {
      const source = sourceList[i];
      if (check === false) {
        try{
          const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${source.slug}/novels/${novelId}`);
          const data = response.data.data.novelInfo;
          if (response.data.data.novelInfo.title !== "") {
            availableSource.push(source)
            check = true;
            checkResData = data
          }
        }
        catch(error)
        {

        }
        
      }
      else {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${source.slug}/novels/${novelId}`);

          //Xử lý lỗi, do bên back chưa xử lỗi nên tui làm theo title
            if (response.data.data.novelInfo.title !== "") {
              availableSource.push(source)
            }
        } catch (err) {
          alert(err)
        }



      }


    }
    const resData = {
      slug: checkResData.slug,
      image: checkResData.image,
      title: checkResData.title,
      categories: checkResData.categories,
      sources: availableSource,
      authors: checkResData.authors,
      status: checkResData.status,
      description: checkResData.description,
    };
    return resData;
  } catch (error) {
    console.error('There was an error making the request!', error);
    throw error;
  }
}

export async function GetAllChapterByNovelId(novelId, sourceSlug) {
  try {
    let chapterPromises = []
    const countChaptersResponses = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${sourceSlug}/novels/${novelId}/chapters?page=1`);
    const countChapterData = countChaptersResponses.data.data.chapters.meta;
    const totalPages = countChapterData.total_pages;
    for (let i = 1; i <= totalPages; i++) {
      chapterPromises.push(axios.get(`${process.env.REACT_APP_BASE_URL}/api/${sourceSlug}/novels/${novelId}/chapters?page=${i}`));
    }
    const responses = await Promise.all(chapterPromises);
    const allChapters = responses.flatMap(response => response.data.data.chapters.chapters);
    return allChapters;
  } catch (error) {
    console.error('There was an error making the request!', error);
    throw error;
  }
}

export async function GetChapterOfNovelContent(novelId, chapterId,sourceSlug) {
  try {

    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${sourceSlug}/novels/${novelId}/chapters/${chapterId}`);
    const data = response.data.data.chapterContent;
    data.novelId = novelId;
    /*
    data: {
      novelId,
      title,
      chapter,
      content,
      nextChapterId,
      prevChapterId
    }
    */
    return data;
  } catch (error) {
    console.error('There was an error making the request!', error);
    throw error;
  }
}
export async function GetHotNovels() {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/hot-stories/0`);
    const data = response.data.data;
    data.forEach(item => {

    });
    /*
    data: [
      {
        novelId,
        img,
        title
      }
    ]
    */
    return data;
  } catch (error) {
    console.error('There was an error making the request!', error);
    throw error;
  }
}