import React, {useContext}  from 'react';
import { Typography, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { ThemeContext } from '../../../data/readingTheme';
export default function Source({ sourceList }) {
    const  {theme } = useContext(ThemeContext);

    return <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
        <Typography sx = {{color: theme.fontColor}} variant="body1" mr={1}>
            Nguồn:
        </Typography>
        <FormControl variant="outlined" sx={{ width: '50%', backgroundColor: '#444' }}>
            <InputLabel id="nguon-label">Nguồn</InputLabel>
            <Select labelId="nguon-label" id="nguonSelect" defaultValue="Tàng thư viện" label="Nguồn">
                <MenuItem value="Tàng thư viện">Tàng thư viện</MenuItem>
            </Select>
        </FormControl>
    </Box>
}