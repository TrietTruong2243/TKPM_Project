import React, { useEffect, useContext, useState } from 'react';
import { Container, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { ThemeContext } from '../../data/readingTheme';
import NovelTitle from './Components/novel_title';
import NovelContent from './Components/novel_content';
import Source from './Components/source';
import ControlButtons from './Components/control_buttons';
import { GetAllChapterByNovelId, GetChapterOfNovelContent, GetNovelByIdService } from '../../service/service';
import CenteredSpinner from '../../spinner/centered_spinner';
const allSource = [
  {
    sourceName: "truyenfull.vn",
  },
  {
    sourceName: "metruyenchu.com.vn",
  }
];

const App = () => {
  const { theme } = useContext(ThemeContext);
  const [readingNovel, setReadingNovel] = useState(null);
  const [allChapter, setAllChapter] = useState(null);
  const { novelId, chapterId } = useParams();

  useEffect(() => {
    const fetchNovelAndChapters = async () => {
      try {
        //Xử lý lưu truyện vào lịch sử
        const readItems = JSON.parse(localStorage.getItem('readItems')) || {};
        if (readItems[novelId])
          {
            delete readItems[novelId]
          }
        readItems[novelId] = chapterId;
        localStorage.setItem('readItems', JSON.stringify(readItems));
        setReadingNovel(null);
        const fetchedNovel = await GetNovelByIdService(novelId);
        const chapters = await GetAllChapterByNovelId(novelId, fetchedNovel.chapterCount, fetchedNovel.chapterPerPage);
        const chapterContent = await GetChapterOfNovelContent(novelId, chapterId);
        setAllChapter(chapters);
        setReadingNovel({ ...chapterContent, chapterId});
        
      } catch (error) {
        console.error('Error fetching novel and chapters:', error);
      }
    };

    fetchNovelAndChapters();
  }, [novelId, chapterId]);

  if (!readingNovel || !allChapter) {
    return <CenteredSpinner></CenteredSpinner>
  }

  return (
    <Box sx={{ backgroundColor: theme.backgroundColor, color: theme.fontColor, fontFamily: theme.fontFamily, padding: '20px' }}>
      <Container>
        <NovelTitle sx={{ fontFamily: theme.fontFamily }} readingNovel={readingNovel} />
        <Source sourceList={allSource} />
        <ControlButtons novelId={novelId} readingNovel={readingNovel} allChapter={allChapter} />
        <NovelContent readingNovel={readingNovel} />
        <ControlButtons novelId={novelId} readingNovel={readingNovel} allChapter={allChapter} />
      </Container>
    </Box>
  );
};

export default App;
