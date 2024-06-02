import React, { useState } from 'react';
import { Container, Box, Typography, Grid, Paper, List, ListItem, ListItemText, Pagination } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Navigate, useNavigate } from "react-router-dom";

export default function HotNovel({ hotNovels }) {
    const navigate = useNavigate();
    return <Box sx={{ border: 2 }}>
        <Container>
            <Typography variant="h6" gutterBottom>Truyện hot</Typography>
            {hotNovels.map((related, index) => (
                <Box key={index} mb={3} display="flex" alignItems="center"
                    onClick={() => {
                        navigate(`/description/${related.novelId}`)
                    }}>
                    <Box mr={2}>
                        <img src={related.img} alt={related.title} style={{ width: 60, borderRadius: 8 }} />
                    </Box>
                    <Typography variant="body2">{related.title}</Typography>
                </Box>
            ))}
        </Container>
    </Box>
}