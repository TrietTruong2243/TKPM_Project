import React, { useEffect, useContext, useState } from 'react';
import { Container, Box } from '@mui/material';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext } from './readingTheme.jsx';
import NovelTitle from './Components/novel_title';
import NovelContent from './Components/novel_content';
import Source from './Components/source';
import ControlButtons from './Components/control_buttons';
import NovelSourceManager from "../../data/novel_source_manager.js";
import { GetAllChapterByNovelId, GetChapterOfNovelContent, GetNovelByIdService } from '../../service/service';
import CenteredSpinner from '../../spinner/centered_spinner';
import NovelDescriptionManager from '../../data/novel_description_manager.js';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};
const App = () => {
  const navigate = useNavigate();
  let source1 = useQuery();
  const [source, setSource] = useState(null);
  const { theme } = useContext(ThemeContext);
  const [readingNovel, setReadingNovel] = useState(null);
  const [allChapter, setAllChapter] = useState(null);
  const [allSource, setAllSource] = useState(null)
  const { novelId, chapterId } = useParams();
  let novel_source_manager = NovelSourceManager.getInstance();
  let novel_description_manager=NovelDescriptionManager.getInstance();
  const [source_data, setSourceData] = useState([]);

  useEffect(() => {
    novel_source_manager.get().then(res => {
      setSourceData([...res]);
    });
  }, []);
  useEffect(() => {
    const fetchNovelAndChapters = async () => {
      try {
        if (source_data.length > 0) {
          //Xử lý lưu truyện vào lịch sử
          const readItems = JSON.parse(localStorage.getItem('readItems')) || {};
          if (readItems[novelId]) {
            delete readItems[novelId]
          }
          readItems[novelId] = chapterId;
          localStorage.setItem('readItems', JSON.stringify(readItems));
          // setReadingNovel(null);


          const fetchedNovel = await GetNovelByIdService(novelId, source_data);
          setAllSource(fetchedNovel.sources);
          if (fetchedNovel) {
            let sourceFromQuery = source1.get("source");
            if (!sourceFromQuery) {
              sourceFromQuery = fetchedNovel.sources[0].slug;
              navigate(`/description/${novelId}/chapter/${chapterId}?source=${sourceFromQuery}`);
            }
            setSource(sourceFromQuery);
            const chapterContent = await GetChapterOfNovelContent(novelId, chapterId, source);
            if (chapterContent) {
              setReadingNovel({ ...chapterContent, chapterId });
            }
            // setReadingNovel({ ...chapterContent, chapterId });
            // console.log(readingNovel)

            const fetchedChapters = await GetAllChapterByNovelId(novelId, source);
            if (fetchedChapters) {
              setAllChapter(fetchedChapters);
            }
          }

        }
      } catch (error) {
        console.error('Error fetching novel and chapters:', error);
      }
    };

    fetchNovelAndChapters();
  }, [novelId, chapterId, source_data, source]);

  if (!readingNovel || !allChapter) {
    return <CenteredSpinner></CenteredSpinner>
  }
  if (!allChapter)
    {
      return (
        <Box sx={{ backgroundColor: theme.backgroundColor, color: theme.fontColor, fontFamily: theme.fontFamily, padding: '20px' }}>
          <Container>
            <NovelTitle sx={{ fontFamily: theme.fontFamily }} readingNovel={readingNovel} />
            <Source sourceList={allSource} sourceValue={source} novelId={novelId} chapterId={chapterId} />
            <NovelContent readingNovel={readingNovel} />
          </Container>
        </Box>
      );
    }
  return (
    <Box sx={{ backgroundColor: theme.backgroundColor, color: theme.fontColor, fontFamily: theme.fontFamily, padding: '20px' }}>
      <Container>
        <NovelTitle sx={{ fontFamily: theme.fontFamily }} readingNovel={readingNovel} />
        <Source sourceList={allSource} sourceValue={source} novelId={novelId} chapterId={chapterId} />
        <ControlButtons novelId={novelId} readingNovel={readingNovel} allChapter={allChapter} sourceValue={source} />
        <NovelContent readingNovel={readingNovel} />
        <ControlButtons novelId={novelId} readingNovel={readingNovel} allChapter={allChapter} sourceValue={source} />
      </Container>
    </Box>
  );
};

export default App;
