import React, { useContext } from 'react';
import { Typography, Box, Select, MenuItem, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

import { ThemeContext } from '../reading_page_theme';

function SourceComboBox({ novelId,sourceValue,allChapterSourceList }) {
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();

    if (allChapterSourceList.length === 0) {
        return (
            <Spinner animation="border" />
        );
    }


    const handleChange = (event) => {
        const selectedSourceSlug = event.target.value;
        const selectedSource = allChapterSourceList.find((source) => source.sourceSlug === selectedSourceSlug);
        
        if (selectedSource) {
            if (selectedSource.error)
                {
                    alert("Chương truyện tương ứng từ nguồn này không khả dụng!")
                }
                else{
                    navigate(`/description/${novelId}/chapter`, {
                        state: {
                            sourceSlug: selectedSource.sourceSlug,
                            chapterSlug: selectedSource.slug,
                            chapterPosition: selectedSource.position
                        }
                    });
                }
         
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" mb={3} sx={{width:'100%'}}>
            <Typography sx={{ color: theme.fontColor }} variant="body1" mr={1}>
                Nguồn:
            </Typography>
            <FormControl variant="outlined" sx={{ width: '50%', backgroundColor: '#444' }}>
                <Select
                    labelId="nguon-label"
                    id="nguonSelect"
                    value={sourceValue}
                    label="Nguồn"
                    onChange={handleChange}
                >
                    {allChapterSourceList.map((source) => (
                        <MenuItem
                            key={source.sourceSlug}
                            value={source.sourceSlug}
                            sx={{ color: 'white', fontSize: '1.2rem' }}
                        >
                            {source.sourceName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}

export default SourceComboBox;
