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
import { Spinner } from 'react-bootstrap';
import ReadingHistoryManager from '../../data/reading_history_manager.js';

function ReadingPage () {
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search)
  let query_source = queryParameters.get('source');
  const [source, setSource] = useState(null);
  const { theme } = useContext(ThemeContext);
  const [readingNovel, setReadingNovel] = useState(null);
  const [allChapter, setAllChapter] = useState(null);
  const [allSource, setAllSource] = useState(null)
  const { novelId, chapterId } = useParams();
  let novel_source_manager = NovelSourceManager.getInstance();
  let novel_description_manager=NovelDescriptionManager.getInstance();
  let reading_history_manager=ReadingHistoryManager.getInstance();
  if(query_source){
    novel_description_manager.current_source=query_source;
  }
  novel_description_manager.set({novel_slug:novelId})
  useEffect(() => {
    reading_history_manager.saveNewReadingNovel(novelId,chapterId);
    novel_description_manager.get().then(res=>{
      setAllSource(novel_description_manager.available_source)
      novel_description_manager.getAllChapter().then((res)=>{
        if(res){
          setAllChapter([...res]);
        }
      })
      if(res){
        if(!query_source){
          query_source=novel_description_manager.current_source;
          if(!query_source){
            navigate(`/description/${novelId}/chapter/${chapterId}?source=${query_source}`);
          }
        }
        setSource(query_source)
        console.log(novel_description_manager.novel_info)

        novel_description_manager.getChapterContent(chapterId).then((res)=>{
          if(res){
            setReadingNovel({...res,chapterId});
            reading_history_manager.saveNewReadingNovel(novelId,chapterId,query_source,novel_description_manager.novel_info,res);
          }
        })
      }
    })
  }, []);

  if (!readingNovel || !allChapter) {
    return <CenteredSpinner></CenteredSpinner>
  }
  else
    if (!allChapter) {
      return (
        <Box sx={{ backgroundColor: theme.backgroundColor, color: theme.fontColor, fontFamily: theme.fontFamily, padding: '20px' }}>
          <Container>

            <NovelTitle sx={{ fontFamily: theme.fontFamily }} readingNovel={readingNovel} />
            <Spinner animation="border" />;
            <Source sourceList={allSource} sourceValue={source} novelId={novelId} chapterId={chapterId} />
            <NovelContent readingNovel={readingNovel} />

          </Container>
        </Box>
      );
    }
    else {
      return (
        <Box sx={{ backgroundColor: theme.backgroundColor, color: theme.fontColor, fontFamily: theme.fontFamily, padding: '20px' }}>
          <Container>
            <NovelTitle sx={{ fontFamily: theme.fontFamily }} readingNovel={readingNovel} />
            <Source sourceList={allSource} sourceValue={source} novelId={novelId} chapterId={chapterId} />
            <ControlButtons novelId={novelId} readingNovel={readingNovel} allChapter={allChapter} sourceValue={source} />
            <NovelContent readingNovel={readingNovel} />
            {/* <ControlButtons novelId={novelId} readingNovel={readingNovel} allChapter={allChapter} sourceValue={source} /> */}
          </Container>
        </Box>
      );
    }

};

export default  ReadingPage;
