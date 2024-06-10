import axios from 'axios';
export async function getNovelDescription(novel_slug,source){
  try{
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${source}/novels/${novel_slug}`);
    const data = response.data.data.novelInfo;
    if (data.title === "") {
       return ;
    }
    return data;
  }
  catch(error)
  {
    return ;
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
  }
}

export async function GetChapterOfNovelContent(novelId, chapterId,sourceSlug) {
  try {

    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${sourceSlug}/novels/${novelId}/chapters/${chapterId}`);
    const data = response.data.data.chapterContent;
    data.novelId = novelId;
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