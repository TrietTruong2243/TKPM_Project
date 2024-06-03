import React, { useEffect, useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CenteredSpinner from '../../../spinner/centered_spinner';
export default function HotNovel({ hotNovels }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [novels, setNovels] = useState([]);

    useEffect(() => {
        // Giả định hotNovels được truyền vào khi component mount
        if (hotNovels && hotNovels.length > 0) {
            setNovels(hotNovels);
            setIsLoading(false);
        }
    }, [hotNovels]);

    return (
        <Box sx={{ border: 2 }}>
            <Container>
                <Typography variant="h6" gutterBottom>Truyện hot</Typography>
                {isLoading ? (
                    // <Typography variant="body2">Đang tải...</Typography>
                    <CenteredSpinner></CenteredSpinner>
                ) : (
                    novels.map((related, index) => (
                        <Box
                            key={index}
                            mb={3}
                            display="flex"
                            alignItems="center"
                            sx={{ cursor: "pointer" }}
                            onClick={() => {
                                navigate(`/description/${related.novelId}`);
                            }}
                        >
                            <Box mr={2}>
                                <img src={related.img} alt={related.title} style={{ width: 60, borderRadius: 8 }} />
                            </Box>
                            <Typography variant="body2">{related.title}</Typography>
                        </Box>
                    ))
                )}
            </Container>
        </Box>
    );
}
