import React from 'react';
import { Typography } from '@mui/material';
export default function NovelTitle({ readingNovel }) {
    return  <><Typography variant="h1" align="center" gutterBottom>
    {readingNovel.title}
  </Typography>
  <Typography variant="h6" align="center" gutterBottom>
  {readingNovel.chapter}
  </Typography>
  </>
}