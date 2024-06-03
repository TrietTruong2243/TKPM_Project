// src/App.js
import React, { useState } from 'react';
import "../../styles/history_page.css";
import { Container, CssBaseline, Typography, Box, Grid, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ReadItems from './Components/historyReadingList';

function App() {
    const [searchValue, setSearchValue] = useState(1);

    const updateSearchType = (event) => {
        setSearchValue(event.target.value);
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg" className="main-content">
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={9}>
                        <Typography variant="h1" style={{ color: '#fff' }}>Truyện đã đọc gần đây</Typography>
                        <TableContainer component={Paper} style={{ backgroundColor: '#000' }}>
                            <Table sx={{ minWidth: 650, border: 3 }}>
                                <TableHead style={{ backgroundColor: '#212121', color: '#fff' }}>
                                    <TableRow>
                                        <TableCell>Hình ảnh</TableCell>
                                        <TableCell>Tên truyện</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell>Đã đọc đến</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <ReadItems searchValue={searchValue} />
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Box sx={{ bgcolor: '#616161', borderRadius: "16px" }}>
                            <Container>
                                <Typography variant="h5">Sắp xếp truyện</Typography>
                                <FormControl fullWidth variant="outlined" margin="normal">
                                    <InputLabel>Theo</InputLabel>
                                    <Select
                                        label="Theo tên truyện"
                                        onChange={updateSearchType}
                                        defaultValue={1}
                                    >
                                        <MenuItem value={1}>Theo thứ tự đọc gần nhất</MenuItem>
                                        <MenuItem value={2}>Theo thứ tự đọc xa nhất</MenuItem>
                                        <MenuItem value={3}>Theo tên từ A đến Z</MenuItem>
                                        <MenuItem value={4}>Theo tên từ Z đến A</MenuItem>
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
