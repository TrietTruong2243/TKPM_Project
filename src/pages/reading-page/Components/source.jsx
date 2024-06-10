import React, {useContext}  from 'react';
import { Typography, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { ThemeContext } from '../readingTheme';
import { useNavigate } from 'react-router-dom';

export default function Source({novelId,chapterId, sourceList,sourceValue }) {
    const  {theme } = useContext(ThemeContext);
    const navigate = useNavigate()

    return <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
        <Typography sx = {{color: theme.fontColor}} variant="body1" mr={1}>
            Nguồn:
        </Typography>
        <FormControl variant="outlined" sx={{ width: '50%', backgroundColor: '#444' }}>
            <Select labelId="nguon-label" id="nguonSelect" defaultValue={sourceValue} label="Nguồn">
                {sourceList.map((source) =>(
                
                    <MenuItem value={source.slug}         onClick={() => window.location.href = `/description/${novelId}/chapter/${chapterId}?source=${source.slug}`}
> {source.name}</MenuItem>
                )

                )}
            </Select>
        </FormControl>
    </Box>
}