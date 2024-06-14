import React, { useContext } from "react";
import { Typography, Box } from "@mui/material";

import { ThemeContext } from "../reading_page_theme";

function NovelContent({ readingNovel }) {
  const { theme } = useContext(ThemeContext);
  return (
    <Box>
      <Typography
        style={{ fontSize: theme.fontSize, fontFamily: theme.fontFamily }}
        paragraph
        dangerouslySetInnerHTML={{ __html: readingNovel.content }}
      />
    </Box>
  );
}

export default NovelContent;
