import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DescriptionComponent from '../components/description_components.jsx';
import HotNovel from '../components/hot_novel_list.jsx';
import AllChapters from '../components/all_chapter_box.jsx';
import NovelSourceManager from "../../../data-manager/novel_source_manager.js";
import HotNovelManager from "../../../data-manager/hot_novels_manager.js";
import NovelDescriptionManager from '../../../data-manager/novel_description_manager.js';


function DescriptionPage() {
    const novel_source_manager = NovelSourceManager.getInstance();
    const hot_novels_manager = HotNovelManager.getInstance();
    const novel_description_manager=NovelDescriptionManager.getInstance();
    const [source_data, setSourceData] = useState([]);
    const { novelId } = useParams();
    
    const [novel, setNovel] = useState(null);
    const [allChapters, setAllChapters] = useState([]);
    const [hotNovels, setHotNovels] = useState([]);
    const [source, setSource] = useState(null)
    novel_description_manager.set({novel_slug:novelId})
    useEffect(() => {
        novel_source_manager.get().then(res => {
            setSourceData([...res]);
        });
        hot_novels_manager.get().then(res=>{
            setHotNovels([...res]);
        });
    }, []);

    useEffect(() => {      
        setNovel(null)
        setAllChapters([])
        if (source_data.length > 0) { // Ensure source_data is available
            try {
                novel_description_manager.get().then(res=>{
                    setNovel(res);
                    novel_description_manager.getAllChapter().then((res)=>{
                       
                        setAllChapters(res);
                    })
                })
            } catch (error) {
                console.error('Error fetching novel and chapters:', error);
            }
        }        
    }, [novelId, source_data,source]); // Add source_data as a dependency

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
    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <DescriptionComponent novel={novel} available_source={novel_description_manager.available_source}></DescriptionComponent>
                            <AllChapters allChapters={allChapters} source = {novel_description_manager.current_source}></AllChapters>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <HotNovel hotNovels={hotNovels}></HotNovel>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}


export default DescriptionPage;
