import React from 'react';
import { Box, Typography, Grid} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

export default function DescriptionComponent({novel}) {
    // const genreNames = novel.genres.map((genre,index) => genre.genreName);
    if (!novel) {
        return <Typography variant="body1">Loading...</Typography>;
      }
    return <Box>
    <Grid container spacing={2}>
        <Grid item xs={12} md={3} textAlign="center">
            <img
                src={novel.img}
                alt={novel.title}
                style={{ width: '100%', borderRadius: 8 }}
            />
        </Grid>
        <Grid item xs={12} md={9}>
            <Typography variant="h4" gutterBottom>
                {novel.title} <DownloadIcon />
            </Typography>
            <Typography variant="body1"><strong>Tác giả:</strong> {novel.authors.map((genre) => genre.authorName).join(", ")}</Typography>
            <Typography variant="body1"><strong>Thể loại:</strong>{ novel.genres.map((genre) => genre.genreName).join(", ")} </Typography>
            <Typography variant="body1"><strong>Nguồn:</strong> {novel.source}</Typography>
            <Typography variant="body1"><strong>Trạng thái:</strong> {novel.status} </Typography>
        </Grid>
    </Grid>
    <Box mt={3}>
        <Typography variant="h5"  >
            Giới thiệu:
        </Typography>
    
        <Typography variant="body1" paragraph dangerouslySetInnerHTML={{ __html: novel.description }} />
    
    </Box>
    </Box>
}
