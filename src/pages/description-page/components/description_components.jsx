import React from 'react';
import { Box, Typography, Grid} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

function DescriptionComponent({novel,available_source}) {
    if (!novel) {
        return <Typography variant="body1">Loading...</Typography>;
    }
    return (
    <Box>
        <Grid container spacing={2}>
            <Grid item xs={12} md={3} textAlign="center">
                <img
                    src={novel.image}
                    alt={novel.title}
                    style={{ width: '100%', borderRadius: 8 }}
                />
            </Grid>
            <Grid item xs={12} md={9}>
                <Typography variant="h4" gutterBottom>
                    {novel.title}
                     {/* <DownloadIcon /> */}
                </Typography>
                <Typography variant="body1"><strong>Tác giả:</strong> {novel.authors.map((genre) => genre.name).join(", ")}</Typography>
                <Typography variant="body1"><strong>Thể loại:</strong>{ novel.categories.map((genre) => genre.name).join(", ")} </Typography>
                <Typography variant="body1"><strong>Nguồn:</strong> { available_source.map((genre) => genre.name).join(", ")}</Typography>
                <Typography variant="body1"><strong>Trạng thái:</strong> {novel.status} </Typography>
                {available_source[0].name&&<Typography variant="body1"><strong>Nguồn hiện tại:</strong> {available_source[0].name} </Typography>}
            </Grid>
        </Grid>
        <Box mt={3}>
            <Typography variant="h5"  >
                Giới thiệu:
            </Typography>    
            <Typography variant="body1" paragraph dangerouslySetInnerHTML={{ __html: novel.description }} />    
        </Box>
    </Box>
    )
}


export default DescriptionComponent;