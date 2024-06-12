import React, { useEffect, useContext, useState } from 'react';
import { Container, Box } from '@mui/material';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {ThemeContext} from './reading_page_theme.jsx';
import NovelTitle from './components/novel_title.jsx';
import NovelContent from './components/novel_content.jsx';
import Source from './components/source_combo_box.jsx';
import ControlButtons from './components/control_buttons.jsx';
import NovelSourceManager from "../../data-manager/novel_source_manager.js";
import CenteredSpinner from '../../components/centered_spinner.jsx';
import NovelDescriptionManager from '../../data-manager/novel_description_manager.js';
import { Spinner } from 'react-bootstrap';
import ReadingHistoryManager from '../../data-manager/reading_history_manager.js';

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
    let novel_description_manager=NovelDescriptionManager.getInstance();
    let reading_history_manager=ReadingHistoryManager.getInstance();
    if(query_source){
        novel_description_manager.current_source=query_source;
    }
    novel_description_manager.set({novel_slug:novelId})
    useEffect(() => {
        setReadingNovel(null)
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
            novel_description_manager.getChapterContent(chapterId).then((res)=>{
            if(res){
                setReadingNovel({...res,chapterId});
                try{
                    reading_history_manager.saveNewReadingNovel(novelId,chapterId,query_source,novel_description_manager.novel_info,res);
                }catch(error){
                }
            }
            })
        }
        })
    }, [chapterId]);

    if (readingNovel===null ) {
        return <CenteredSpinner></CenteredSpinner>
    }
    else
        if (allChapter===null) {
            return (
            <Box sx={{ backgroundColor: theme.backgroundColor, color: theme.fontColor, fontFamily: theme.fontFamily, padding: '20px' }}>
                <Container>
                    <NovelTitle sx={{ fontFamily: theme.fontFamily }} readingNovel={readingNovel} />
                    <Source sourceList={allSource} sourceValue={source} novelId={novelId} chapterId={chapterId} />
                    <Box sx={{marginLeft:'50%'}}>
                        <Spinner animation="border" />
                    </Box>
                    <NovelContent readingNovel={readingNovel} />
                </Container>
            </Box>
            );
        }
        else {
            return (
                <Box sx={{ backgroundColor: theme.backgroundColor, color: theme.fontColor, fontFamily: theme.fontFamily, padding: '20px' }}>
                    <Container>
                        <NovelTitle sx={{ fontFamily: theme.fontFamily }} readingNovel={readingNovel} novelName={novel_description_manager.novel_info.title} />
                        <Source sourceList={allSource} sourceValue={source} novelId={novelId} chapterId={chapterId} />
                        <ControlButtons novelId={novelId} novelTitle= {novel_description_manager.novel_info.title}readingNovel={readingNovel} allChapter={allChapter} sourceValue={source} />
                        <NovelContent readingNovel={readingNovel} />
                    </Container>
                </Box>
        );
        }

};

export default  ReadingPage;
