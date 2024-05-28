// src/App.js
import React from 'react';
import "../../styles/history_page.css";
import { palette, borders } from '@mui/system';
import { Container, CssBaseline, Typography, Box, Grid, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Badge, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const novels = [
    {
        imgSrc: 'https://via.placeholder.com/100',
        title: 'Ngạo thế đan thần',
        status: ['Full', 'Mới', 'Hot'],
        progress: 'Chương 10'
    },
    {
        imgSrc: 'https://via.placeholder.com/100',
        title: 'Kiều sủng vi thượng',
        status: ['Full', 'Mới', 'Hot'],
        progress: 'Chương 10'
    },
    {
        imgSrc: 'https://via.placeholder.com/100',
        title: 'Kiều sủng vi thượng',
        status: ['Full', 'Mới', 'Hot'],
        progress: 'Chương 10'
    },
    {
        imgSrc: 'https://via.placeholder.com/100',
        title: 'Kiều sủng vi thượng',
        status: ['Full', 'Mới', 'Hot'],
        progress: 'Chương 10'
    }
];

function App() {

    return (
        <React.Fragment >
            <CssBaseline />
            <Container maxWidth="lg" className="main-content">
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={9}>
                        <Typography variant="h1" style={{ color: '#fff' }}>Truyện đã đọc gần đây</Typography>
                        <TableContainer component={Paper} style={{ backgroundColor: '#000' }}>
                            <Table sx={{ minWidth: 650, border: 3 }}>
                                <TableHead style={{ backgroundColor: '#212121', color: '#fff' }}>  {/* Adjust header background and text color */}
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell>Tên truyện</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell>Đã đọc đến</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {novels.map((novel, index) => (
                                        <TableRow key={index}>
                                            <TableCell><img style={{ width: '100px', height: '150px' }} src={novel.imgSrc} alt={novel.title} /></TableCell>
                                            <TableCell style={{ color: '#fff' }}>{novel.title}</TableCell>
                                            <TableCell>
                                                <Box display="flex" flexWrap="wrap" gap={4}>
                                                    {novel.status.map((status, idx) => (
                                                        <Box key={idx}>
                                                            <Badge badgeContent={status} color={status === 'Full' ? 'success' : status === 'Mới' ? 'primary' : 'error'} />
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </TableCell>
                                            <TableCell style={{ color: '#fff' }}>{novel.progress}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12} sm={3} >
                        <Box sx={{ bgcolor: '#616161', borderRadius: "16px" }}>
                            <Container>
                                <Typography variant="h5">Sắp xếp truyện</Typography>
                                <FormControl fullWidth variant="outlined" margin="normal">
                                    <InputLabel>Theo tên truyện</InputLabel>
                                    <Select
                                        label="Theo tên truyện"
                                    >
                                        <MenuItem value="A-Z">Từ A đến Z</MenuItem>
                                        <MenuItem value="Z-A">Từ Z đến A</MenuItem>
                                    </Select>
                                </FormControl>
                                <Typography variant="h6">Theo trạng thái:</Typography>
                                <FormControlLabel control={<Checkbox defaultChecked />} label="Full" />
                                <FormControlLabel control={<Checkbox defaultChecked />} label="Mới" />
                                <FormControlLabel control={<Checkbox defaultChecked />} label="Hot" />
                            </Container>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    );
}

export default App;
