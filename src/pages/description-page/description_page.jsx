import React, { useState } from 'react';
import { Container, Box, Typography, Grid, Paper, List, ListItem, ListItemText, Pagination } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Navigate, useNavigate } from "react-router-dom";

import DownloadIcon from '@mui/icons-material/Download';
const novel =
{
    img: 'https://via.placeholder.com/100',
    title: 'Ngạo thế đan thần',
    genres: ["Ngôn tình", "Trọng sinh", "Cổ đại"],
    author: "Diệp Kiến Tình",
    source: "truyenfull.vn",
    status: ['Full', 'Mới', 'Hot'],
    progress: 'Chương 10',
    description:
        "Đoạn trích: Thẩm Xu là một đặc thám di thái ái hoàn ở Hưng Nô xã với một nam sau khi bên giao chiến, nàng vốn là công chúa không được sủng ái toàn bộ Hưng Nô trở về nhà. <br> Khi mọi ý niệm đã hòa thành tro tàn, nàng tận mắt thấy nam nhân mẫu lạnh vô tình trong lời đồn vì nàng mà chết trận nơi sa trường. <br> Mọi người chỉ biết, Linh An công chúa vì trảm hộ mà giả cho gian thần. <br> Bùi Văn Khiêm hi nội vô thường, hung ác nham hiểm, chỉ có không lâu sau, công chúa ai thường liệt ngọc vấn an. <br>Nàng trùng sinh vào một buổi tối trước ngày hỏa thiêu, nghiêng nghiêng ngã ngã lảo đảo chạy ra khỏi tẩm điện, trực tiếp đâm vào trong ngực Bùi Văn Khiêm. Tần sắc của hắn nhàn nhạt không trông thấy mỹ mãn, ánh mắt trào phúng mà lạnh như băng như nước quyền rủ động lòng: \"Ta không muốn đi hoàn thân, tướng quân có nguyện ý cứu ta không?\"."

}
const hotNovels = [{
    title: 'Sau Khi Xuyên Sách, Tôi Thành Người Duy Nhất Của Nam Phụ Thầm Tình',
    img: 'https://inkythuatso.com/uploads/thumbnails/800/2023/03/1-hinh-anh-ngay-moi-hanh-phuc-sieu-cute-inkythuatso-09-13-35-50.jpg'
}, {
    title: 'Võ Khí Thần Bí Của Sát Thủ',
    img: 'https://inkythuatso.com/uploads/thumbnails/800/2023/03/1-hinh-anh-ngay-moi-hanh-phuc-sieu-cute-inkythuatso-09-13-35-50.jpg'
}]
export default function DescriptionPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [chaptersPerPage, setChaptersPerPage] = useState(15);
    const totalChapters = 303;
    const navigate = useNavigate()

    const chapters = Array.from({ length: totalChapters }, (_, i) => `Chương ${i + 1}`);

    const getStartingIndex = (currentPage) => {
        return (currentPage - 1) * chaptersPerPage;
    };

    const getEndingIndex = (currentPage) => {
        return Math.min(currentPage * chaptersPerPage, totalChapters);
    };

    const displayedChapters = chapters.slice(getStartingIndex(currentPage), getEndingIndex(currentPage));

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

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
                            <Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={3} textAlign="center">
                                        <img
                                            src={novel.img}
                                            alt={novel.title}
                                            style={{ width: '100%', borderRadius: 8 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={9}>
                                        <Typography variant="h4" gutterBottom>
                                            {novel.title} <DownloadIcon />
                                        </Typography>
                                        <Typography variant="body1"><strong>Tác giả:</strong> {novel.author}</Typography>
                                        <Typography variant="body1"><strong>Thể loại:</strong>{novel.genres.join(", ")} </Typography>
                                        <Typography variant="body1"><strong>Nguồn:</strong> {novel.source}</Typography>
                                        <Typography variant="body1"><strong>Trạng thái:</strong> {novel.status.join(", ")} </Typography>
                                    </Grid>
                                </Grid>
                                <Box mt={3}>
                                    {/* <Typography variant="body1" paragraph> */}

                                    <Typography variant="body1" paragraph dangerouslySetInnerHTML={{ __html: novel.description }} />
                                    {/* </Typography> */}

                                </Box>
                            </Box>
                            {/* <Box mt={4}>
                                <Paper elevation={2} sx={{ p: 2 }}>
                                    <Typography variant="h6" align="center">Danh sách chương</Typography>
                                    <List>
                                        {['Chương 1: Tí: Trùng Sinh', 'Chương 2: Tí: Hôn', 'Chương 3: Tí: Tả Hộ', 'Chương 4: Tí: Giá Tế', 'Chương 5: Chí: Ngộ', 'Chương 6: Chí: Sủng', 'Chương 7: Chí: Hạnh Phúc', 'Chương 8: Chí: Bình Phúc', 'Chương 9: Chí: Bình Phúc', 'Chương 10: Chí: Bạc Vận', 'Chương 11: Tâm: Tùng', 'Chương 12: Tâm: Tuyển', 'Chương 13: Tâm: Phúc Qua', 'Chương 14: Bệnh: Việc Người Mình', 'Chương 15: Hồi: Ngọc Viễn'].map((chapter, index) => (
                                            <ListItem key={index}>
                                                <ListItemText primary={chapter} />
                                            </ListItem>
                                        ))}
                                    </List>
                                    <Pagination count={10} color="primary" sx={{ display: 'flex', justifyContent: 'center' }} />
                                </Paper>
                            </Box> */}
                            <Box mt={4} sx={{border: 1}} >
                                <Paper elevation={2} sx={{ p: 2 }}>
                                    <Typography variant="h6" align="center">Danh sách chương</Typography>
                                    <List>
                                        {displayedChapters.map((chapter, index) => (
                                            <ListItem key={index}  onClick={() => navigate(`chapter/${index+1}`)}>
                                                <ListItemText primary={chapter} />
                                            </ListItem>
                                        ))}
                                    </List>
                                    <Pagination
                                        count={Math.ceil(totalChapters / chaptersPerPage)}
                                        page={currentPage}
                                        onChange={handleChangePage}
                                        color="primary"
                                        sx={{ display: 'flex', justifyContent: 'center' }}
                                    />
                                </Paper>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{border: 2}}>
                                <Container>
                                <Typography variant="h6" gutterBottom>Truyện liên quan</Typography>
                                {hotNovels.map((related, index) => (
                                    <Box key={index} mb={3} display="flex" alignItems="center">
                                        <Box mr={2}>
                                            <img src={related.img} alt={related.title} style={{ width: 60, borderRadius: 8 }} />
                                        </Box>
                                        <Typography variant="body2">{related.title}</Typography>
                                    </Box>
                                ))}
                                </Container>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}

