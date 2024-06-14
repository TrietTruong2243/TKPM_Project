import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import NovelDescriptionManager from "../../../data-manager/novel_description_manager";

function AllChapters({ novelId, source }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedChapters, setDisplayedChapters] = useState([]);
  const instance = NovelDescriptionManager.getInstance();
  const [meta, setMeta] = useState(null);
  const [chaptersPerPage, setChaptersPerPage] = useState(0);
  const [is_loading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMeta = async () => {
      setIsLoading(true);
      try {
        await instance.reload();
        const meta = await instance.getMetaChapterByNovel();
        setMeta(meta);
        setChaptersPerPage(meta.per_page);
        setCurrentPage(1);
      } catch (error) {
        console.error("Failed to fetch meta:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeta();
  }, [instance, novelId]);

  useEffect(() => {
    const fetchChapters = async () => {
      setIsLoading(true);
      try {
        const chapters = await instance.getChaptersByPage(currentPage);
        setDisplayedChapters(chapters);
      } catch (error) {
        console.error("Failed to fetch chapters:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (meta) {
      fetchChapters();
    }
  }, [currentPage, meta]);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  if (!source) {
    return (
      <Box mt={4} sx={{ border: 1 }}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        </Paper>
      </Box>
    );
  }
  console.log(displayedChapters);

  return (
    <Box mt={4} sx={{ border: 1 }}>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6" align="center">
          Danh sách chương
        </Typography>
        {is_loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : displayedChapters.length > 0 ? (
          <>
            <List>
              {displayedChapters.map((chapter, index) => (
                <ListItem
                  key={index}
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(`chapter`, {
                      state: {
                        chapterSlug: chapter.slug,
                        chapterPosition: chapter.position,
                        sourceSlug: source,
                      },
                    })
                  }
                >
                  <ListItemText primary={`${chapter.title}`} />
                </ListItem>
              ))}
            </List>
            <Pagination
              count={Math.ceil(meta.total_pages)}
              page={currentPage}
              onChange={handleChangePage}
              color="primary"
              sx={{ display: "flex", justifyContent: "center" }}
            />
          </>
        ) : (
          <Typography variant="body2" align="center">
            Không có chương nào để hiển thị
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

export default AllChapters;
