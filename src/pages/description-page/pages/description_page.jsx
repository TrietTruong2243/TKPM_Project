import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import DescriptionComponent from '../components/description_components.jsx';
import HotNovel from '../components/hot_novel_list.jsx';
import AllChapters from '../components/all_chapter_box.jsx';
import NovelSourceManager from "../../../data-manager/novel_source_manager.js";
import HotNovelManager from "../../../data-manager/hot_novels_manager.js";
import NovelDescriptionManager from '../../../data-manager/novel_description_manager.js';


function DescriptionPage() {
    const navigate = useNavigate();
    const novel_source_manager = NovelSourceManager.getInstance();
    const hot_novels_manager = HotNovelManager.getInstance();
    const novel_description_manager = NovelDescriptionManager.getInstance();
    const [source_data, setSourceData] = useState([]);
    const [available_source, setAvailableSource] = useState([]);
    const { novelId } = useParams();
    const [novel, setNovel] = useState(null);
    const [hot_novels, setHotNovels] = useState([]);
    const [source, setSource] = useState(null);
    const [alertCheck, setAlertCheck] = useState(false);
    const theme = createTheme({
        palette: {
            mode: 'dark',
            background: {
                default: '#000',
                paper: '#333',
            },
            text: {
                primary: '#fff',
            },
        },
    });


    novel_description_manager.set({ novel_slug: novelId })
    useEffect(() => {
        novel_source_manager.reload().then(() => {
            setSourceData([...novel_source_manager.get('sources')]);
        });
        hot_novels_manager.reload().then(() => {
            setHotNovels([...hot_novels_manager.get('hot_novels')]);
        });
    }, [novelId]);

    useEffect(() => {
        setNovel(null)
        if (source_data.length > 0) { // Ensure source_data is available
            try {
                novel_description_manager.reload().then(() => {
                    setNovel(novel_description_manager.get('novel_info'));
                    setSource(novel_description_manager.get('current_source'))
                    setAvailableSource([...novel_description_manager.get('available_source')]);
                    setAlertCheck(true)
                })
            } catch (error) {
                console.error('Error fetching novel and chapters:', error);
            } finally {
                if (available_source.length === 0 && novel===null && alertCheck ===true) {
                    alert("Truyện không tồn tại!");
                    navigate('/')
                }
            }
        }
    }, [novelId, source_data, source]); // Add source_data as a dependency


    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <DescriptionComponent novel={novel} available_source={available_source}></DescriptionComponent>
                            <AllChapters novelId = {novelId} source={source}></AllChapters>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <HotNovel hotNovels={hot_novels}></HotNovel>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}


export default DescriptionPage;
