import React, { useState, useEffect } from 'react';
import {  Box, Typography, Paper, List, ListItem, ListItemText, Pagination, CircularProgress } from '@mui/material';
import { useNavigate } from "react-router-dom";

function AllChapters({ allChapters, source }) {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [chaptersPerPage] = useState(15);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        if (allChapters.length > 0) {
            setIsLoading(false);
        }
    }, [allChapters]);

    const totalChapters = allChapters.length;

    const getStartingIndex = (currentPage) => {
        return (currentPage - 1) * chaptersPerPage;
    };

    const getEndingIndex = (currentPage) => {
        return Math.min(currentPage * chaptersPerPage, totalChapters);
    };

    const displayedChapters = allChapters.slice(getStartingIndex(currentPage), getEndingIndex(currentPage));

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    useEffect(() => {
        if (currentPage > Math.ceil(totalChapters / chaptersPerPage)) {
            setCurrentPage(1);
        }
    }, [totalChapters, chaptersPerPage, currentPage]);
    if (allChapters.length<=0) {
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
                {isLoading ? (
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
                            count={Math.ceil(totalChapters / chaptersPerPage)}
                            page={currentPage}
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
