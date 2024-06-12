import React, { useState, useEffect } from 'react';
import {  Box, Typography, Paper, List, ListItem, ListItemText, Pagination, CircularProgress } from '@mui/material';
import { useNavigate } from "react-router-dom";

function AllChapters({ all_chapters, source }) {
    const navigate = useNavigate();
    const [current_page, setCurrentPage] = useState(1);
    const [chapters_per_page] = useState(15);
    const [is_loading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        if (all_chapters.length > 0) {
            setIsLoading(false);
        }
    }, [all_chapters]);

    const totalChapters = all_chapters.length;

    const getStartingIndex = (current_page) => {
        return (current_page - 1) * chapters_per_page;
    };

    const getEndingIndex = (current_page) => {
        return Math.min(current_page * chapters_per_page, totalChapters);
    };

    const displayedChapters = all_chapters.slice(getStartingIndex(current_page), getEndingIndex(current_page));

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    useEffect(() => {
        if (current_page > Math.ceil(totalChapters / chapters_per_page)) {
            setCurrentPage(1);
        }
    }, [totalChapters, chapters_per_page, current_page]);
    if (all_chapters.length<=0) {
        return (
                <Box mt={4} sx={{ border: 1 }}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CircularProgress />
                        </Box>
                    </Paper>
                </Box>
            )
    }
    return (
        <Box mt={4} sx={{ border: 1 }}>
            <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" align="center">Danh sách chương</Typography>
                {is_loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                    </Box>
                ) : totalChapters > 0 ? (
                    <>
                        <List>
                            {displayedChapters.map((chapter, index) => (
                                <ListItem key={index} sx={{ cursor: "pointer" }} onClick={() => navigate(`chapter/${chapter.slug}?source=${source}`)}>
                                    <ListItemText primary={`${chapter.title}`} />
                                </ListItem>
                            ))}
                        </List>
                        <Pagination
                            count={Math.ceil(totalChapters / chapters_per_page)}
                            page={current_page}
                            onChange={handleChangePage}
                            color="primary"
                            sx={{ display: 'flex', justifyContent: 'center' }}
                        />
                    </>
                ) : (
                    <Typography variant="body2" align="center">Không có chương nào để hiển thị</Typography>
                )}
            </Paper>
        </Box>
    );
}

export default AllChapters;
