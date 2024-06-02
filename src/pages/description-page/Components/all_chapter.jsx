import React, { useState } from 'react';
import { Container, Box, Typography, Grid, Paper, List, ListItem, ListItemText, Pagination } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Navigate, useNavigate } from "react-router-dom";
export default function AllChapters({allChapters}) {
    
    const navigate = useNavigate();
    //handle for 
    const [currentPage, setCurrentPage] = useState(1);
    const [chaptersPerPage] = useState(15);
    const totalChapters = allChapters.length;
    const chapters = allChapters;
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
    if (!allChapters) {
        return <Typography variant="body1">Loading...</Typography>;
      }
    return <Box mt={4} sx={{ border: 1 }} >
        <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" align="center">Danh sách chương</Typography>
            <List>
                {displayedChapters.map((chapter, index) => (
                    <ListItem key={index} onClick={() => navigate(`chapter/${chapter.chapterId}`)}>
                        <ListItemText primary={`${chapter.chapterName}`} />
                    </ListItem>
                ))}
            </List>
            <Pagination
                count={Math.ceil(allChapters.length / chaptersPerPage)}
                page={currentPage}
                onChange={handleChangePage}
                color="primary"
                sx={{ display: 'flex', justifyContent: 'center' }}
            />
        </Paper>
    </Box>
}