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
    const firstResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${sourceSlug}/novels/${novelId}/chapters?page=1`);
    const countChapterData = firstResponse.data.data.chapters.meta;
    const totalPages = countChapterData.total_pages;

    // Tạo mảng các promise cho các yêu cầu lấy dữ liệu từ các trang khác nhau
    const chapterPromises = Array.from({ length: totalPages }, (_, index) =>
      axios.get(`${process.env.REACT_APP_BASE_URL}/api/${sourceSlug}/novels/${novelId}/chapters?page=${index + 1}`)
    );

    // Gửi các yêu cầu và chờ tất cả các promise hoàn thành
    const responses = await Promise.all(chapterPromises);

    // Lấy danh sách chương từ mỗi phản hồi và hợp nhất thành một mảng
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