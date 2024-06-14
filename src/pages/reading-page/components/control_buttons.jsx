import React, { useState, useMemo, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { Home, Settings, Download } from "@mui/icons-material";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { FixedSizeList as List } from "react-window";

import SettingModal from "./modals/setting_modal";
import DownloadModal from "./modals/download_modal";
import NovelDescriptionManager from "../../../data-manager/novel_description_manager";

const height = 35;

const MenuList = (props) => {
  const { options, children, maxHeight, getValue } = props;
  const [value] = getValue();
  const initialOffset = options.indexOf(value) * height;

  return (
    <List
      height={maxHeight}
      itemCount={children.length}
      itemSize={height}
      initialScrollOffset={initialOffset}
    >
      {({ index, style }) => <div style={style}>{children[index]}</div>}
    </List>
  );
};

function ControlButtons({
  novelId,
  novelTitle,
  readingNovel,
  sourceValue,
  chapterPosition,
}) {
  const [show_modal, setShowModal] = useState(false);
  const [show_download_modal, setShowDownloadModal] = useState(false);
  const navigate = useNavigate();
  const instance = NovelDescriptionManager.getInstance();
  const [meta, setMeta] = useState(null);
  const [is_loading, setIsLoading] = useState(true);
  const [all_chapter, setAllChapter] = useState([]);

  const chapterOptions = useMemo(() => {
    if (all_chapter === null || all_chapter.length === 0) return [];
    setIsLoading(false);

    return all_chapter.map((chapter) => ({
      slug: chapter.slug,
      label: chapter.title,
      position: chapter.position,
    }));
  }, [all_chapter]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const handleDownloadShow = () => setShowDownloadModal(true);
  const handleDownloadClose = () => setShowDownloadModal(false);

  useEffect(() => {
    const fetchMeta = async () => {
      setIsLoading(true);
      try {
        await instance.reload();
        const meta = await instance.getMetaChapterByNovel();
        setMeta(meta);
      } catch (error) {
        console.error("Failed to fetch meta:", error);
      } finally {
        // setIsLoading(false);
      }
    };
    if (instance) {
      fetchMeta();
    }
  }, [instance]);

  useEffect(() => {
    const fetchChapters = async () => {
      if (!meta) return;
      setIsLoading(true);
      try {
        const checkPage = Math.ceil(chapterPosition / meta.per_page);
        const promises = [];
        if (checkPage - 1 > 0) {
          promises.push(instance.getChaptersByPage(checkPage - 1));
        }
        promises.push(instance.getChaptersByPage(checkPage));
        if (checkPage + 1 <= meta.total_pages) {
          promises.push(instance.getChaptersByPage(checkPage + 1));
        }
        const results = await Promise.all(promises);
        const mergedChapters = results.flat();
        setAllChapter(mergedChapters);
      } catch (error) {
        console.error("Failed to fetch chapters:", error);
      } finally {
        // setIsLoading(false);
      }
    };

    fetchChapters();
  }, [meta, chapterPosition, instance]);
  return (
    <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
      <Button
        className="btn-custom"
        sx={{
          backgroundColor: "#444",
          color: "#fff",
          "&:hover": { backgroundColor: "#666" },
          margin: "0 8px",
          width: "48px",
          height: "48px",
          minWidth: "48px",
        }}
        onClick={() => navigate(`/home`)}
      >
        <Home />
      </Button>
      <Button
        className="btn-custom"
        sx={{
          backgroundColor: "#444",
          color: "#fff",
          "&:hover": { backgroundColor: "#666" },
          margin: "0 8px",
          width: "48px",
          height: "48px",
          minWidth: "48px",
        }}
        onClick={() =>
          navigate(`/description/${novelId}/chapter`, {
            state: {
              chapterSlug: readingNovel.prev_slug,
              chapterPosition: chapterPosition - 1,
              sourceSlug: sourceValue,
            },
          })
        }
        disabled={!readingNovel.prev_slug || readingNovel.prev_slug === "#"}
      >
        &laquo;
      </Button>
      {is_loading && <Spinner animation="border" role="status" />}
      {!is_loading && (
        <Select
          components={{ MenuList }}
          styles={{
            control: (base) => ({
              ...base,
              color: "#FFF",
              backgroundColor: "#444",
              width: "400px",
              height: "50px",
            }),
            menu: (base) => ({
              ...base,
              color: "#FFF",
              backgroundColor: "#444",
            }),
            singleValue: (base) => ({
              ...base,
              color: "#FFF",
            }),
          }}
          value={chapterOptions.find(
            (option) => option.slug === readingNovel.chapterId
          )}
          options={chapterOptions}
          onChange={(option) =>
            navigate(`/description/${novelId}/chapter`, {
              state: {
                chapterSlug: option.slug,
                chapterPosition: option.position,
                sourceSlug: sourceValue,
              },
            })
          }
        />
      )}
      <Button
        className="btn-custom"
        sx={{
          backgroundColor: "#444",
          color: "#fff",
          "&:hover": { backgroundColor: "#666" },
          margin: "0 8px",
          width: "48px",
          height: "48px",
          minWidth: "48px",
        }}
        onClick={() =>
          navigate(`/description/${novelId}/chapter`, {
            state: {
              chapterSlug: readingNovel.next_slug,
              chapterPosition: chapterPosition + 1,
              sourceSlug: sourceValue,
            },
          })
        }
        disabled={!readingNovel.next_slug || readingNovel.next_slug === "#"}
      >
        &raquo;
      </Button>
      <Button
        className="btn-custom"
        sx={{
          backgroundColor: "#444",
          color: "#fff",
          "&:hover": { backgroundColor: "#666" },
          margin: "0 8px",
          width: "48px",
          height: "48px",
        }}
        onClick={handleShow}
      >
        <Settings />
      </Button>
      <Button
        className="btn-custom"
        sx={{
          backgroundColor: "#444",
          color: "#fff",
          "&:hover": { backgroundColor: "#666" },
          margin: "0 8px",
          width: "48px",
          height: "48px",
        }}
        onClick={handleDownloadShow}
      >
        <Download />
      </Button>
      <SettingModal show={show_modal} handleClose={handleClose} />
      <DownloadModal
        open={show_download_modal}
        handleClose={handleDownloadClose}
        sourceValue={sourceValue}
        novelSlug={novelId}
        novelName={novelTitle}
        chapterSlug={readingNovel.chapterId}
        chapterName={readingNovel.title}
      />
    </Box>
  );
}

export default ControlButtons;
