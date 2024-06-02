import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DescriptionComponent from './Components/description_components';
import HotNovel from './Components/hot_novel';
import AllChapters from './Components/all_chapter';
import { GetNovelByIdService, GetAllChapterByNovelId ,GetHotNovels} from '../../service/service';

const hotNovels = [{
    novelId: "1331",
    title: 'Sau Khi Xuyên Sách, Tôi Thành Người Duy Nhất Của Nam Phụ Thầm Tình',
    img: 'https://inkythuatso.com/uploads/thumbnails/800/2023/03/1-hinh-anh-ngay-moi-hanh-phuc-sieu-cute-inkythuatso-09-13-35-50.jpg'
}, {
    novelId: "3131",
    title: 'Võ Khí Thần Bí Của Sát Thủ',
    img: 'https://inkythuatso.com/uploads/thumbnails/800/2023/03/1-hinh-anh-ngay-moi-hanh-phuc-sieu-cute-inkythuatso-09-13-35-50.jpg'
}]

export default function DescriptionPage() {
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');
    const novelId = urlParts[urlParts.length - 1];
    const [novel, setNovel] = useState(null);
    const [allChapters, setAllChapters] = useState([]);
    const [hotNovels, setHotNovels] = useState([]); 
    useEffect(() => {
        const fetchNovelAndChapters = async () => {
            try {
                const fetchedNovel = await GetNovelByIdService(novelId);
                setNovel(fetchedNovel);
                const fetchedChapters = await GetAllChapterByNovelId(novelId, fetchedNovel.chapterCount, fetchedNovel.chapterPerPage);
                setAllChapters(fetchedChapters);
                const fetchHotNovels = await GetHotNovels();
                setHotNovels(fetchHotNovels);
            } catch (error) {
                console.error('Error fetching novel and chapters:', error);
            }
        };

        fetchNovelAndChapters();
    }, [novelId]);

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

    if (!novel || !hotNovels) {
        return <div>Loading...</div>;
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <DescriptionComponent novel={novel}></DescriptionComponent>
                            <AllChapters allChapters={allChapters}></AllChapters>
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
