import React from 'react';
import { Typography } from '@mui/material';

function NovelTitle({ readingNovel , novelName}) {
    return (
        <><Typography variant="h1" align="center" gutterBottom>
            {novelName}
        </Typography>
        <Typography variant="h6" align="center" gutterBottom>
            {readingNovel.title}
        </Typography>
        </>
    )
}

export default NovelTitle;