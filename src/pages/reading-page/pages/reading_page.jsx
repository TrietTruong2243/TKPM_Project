import React, { useEffect, useContext, useState } from "react";
import { Stack, Box } from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { ThemeContext } from "../reading_page_theme.jsx";
import NovelTitle from "../components/novel_title.jsx";
import NovelContent from "../components/novel_content.jsx";
import SourceComboBox from "../components/source_combo_box.jsx";
import ControlButtons from "../components/control_buttons.jsx";
import CenteredSpinner from "../../../components/centered_spinner.jsx";
import NovelDescriptionManager from "../../../data-manager/novel_description_manager.js";
import ReadingHistoryManager from "../../../data-manager/reading_history_manager.js";
import ChapterSourceChangeManager from "../../../data-manager/novel_chapter_source_change_manager.js";

function ReadingPage() {
  const { state } = useLocation();
  const { theme } = useContext(ThemeContext);
  const { novelId } = useParams();
  const navigate = useNavigate();

  // Define hooks at the top level
  const [source, setSource] = useState(null);
  const [reading_novel, setReadingNovel] = useState(null);
  const [all_source, setAllSource] = useState(null);
  const [all_chapter_source_list, setAllChapterSourceList] = useState([]);
  const [available, setAvailable] = useState(true);
  const [alert_shown, setAlertShown] = useState(false); // State to track if alert has been shown

  const novel_description_manager = NovelDescriptionManager.getInstance();
  const reading_history_manager = ReadingHistoryManager.getInstance();

  const novelSlug = novelId;
  const chapterId = state?.chapterSlug;
  const chapterPosition = state?.chapterPosition;
  let sourceSlug = state?.sourceSlug;

  if (sourceSlug) {
    novel_description_manager.current_source = sourceSlug;
  }

  useEffect(() => {
    if (!state) return;
    novel_description_manager.set({ novel_slug: novelId });
    novel_description_manager.setSource(sourceSlug);

    setAllSource(null);
    setReadingNovel(null);

    const fetchNovelDescription = async () => {
      try {
        await novel_description_manager.reload();
        setAllSource(novel_description_manager.get("available_source"));

        if (!sourceSlug) {
          const currentSource = novel_description_manager.get("current_source");
          if (currentSource) {
            navigate(`/description/${novelId}/chapter`, {
              state: {
                chapterSlug: chapterId,
                chapterPosition: chapterPosition,
                sourceSlug: currentSource,
              },
            });
          }
        } else {
          novel_description_manager.setSource(sourceSlug);
          setSource(sourceSlug);
          const res = await novel_description_manager.getChapterContent(
            chapterId
          );
          if (res === null) {
            setAvailable(false);
          } else {
            setReadingNovel({ ...res, chapterId });
            try {
              reading_history_manager.saveNewReadingNovel(
                novelId,
                chapterId,
                chapterPosition,
                sourceSlug,
                novel_description_manager.novel_info,
                res
              );
            } catch (error) {
              console.error(error);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchNovelDescription();
  }, [chapterId, sourceSlug]);

  useEffect(() => {
    const fetchChapterSourceList = async () => {
      setAllChapterSourceList([]);
      const chapter_source_change_manager =
        ChapterSourceChangeManager.getInstance();

      await chapter_source_change_manager.set({
        sourceList: all_source,
        novelSlug: novelId,
        chapterSlug: chapterId,
        chapterTitle: reading_novel?.title,
        chapterPosition: chapterPosition,
      });

      const all_data_promises = all_source.map(async (source) => {
        const data =
          await chapter_source_change_manager.getChapterRelatedBySource(
            source.slug,
            source.name
          );
        return data;
      });

      const all_data = await Promise.all(all_data_promises);
      const unique_data = all_data.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.sourceSlug === value.sourceSlug)
      );
      setAllChapterSourceList(unique_data);
    };

    if (chapterId && reading_novel && all_source) {
      fetchChapterSourceList();
    }
  }, [chapterId, reading_novel, all_source, novelId, chapterPosition]);

  useEffect(() => {
    const handleUnavailableSource = async () => {
      if (
        available === false &&
        !alert_shown &&
        all_chapter_source_list.length > 0
      ) {
        alert(`Truyện từ nguồn ${sourceSlug} không khả dụng!`);
        setAlertShown(true); // Mark the alert as shown
        let check = 0;

        for (let i = 0; i < all_chapter_source_list.length; i++) {
          if (
            all_chapter_source_list[i].error ||
            all_chapter_source_list[i].sourceSlug === sourceSlug
          ) {
            check++;
          } else {
            const selected_source = all_chapter_source_list[i];
            alert(`Chuyển tới nguồn ${selected_source.sourceSlug}!`);
            navigate(`/description/${novelSlug}/chapter`, {
              state: {
                sourceSlug: selected_source.sourceSlug,
                chapterSlug: selected_source.slug,
                chapterPosition: selected_source.position,
              },
            });
            break;
          }
        }

        if (check === all_chapter_source_list.length) {
          alert(`Không có nguồn phù hợp`);
          navigate(`/description/${novelSlug}`);
        }
      }
    };

    handleUnavailableSource();
  }, [
    available,
    alert_shown,
    all_chapter_source_list,
    navigate,
    novelSlug,
    sourceSlug,
  ]);

  if (reading_novel === null || !novel_description_manager.get("novel_info")) {
    if (available === false) {
      return null; // Don't render anything if the alert has been shown and navigation is pending
    } else {
      return <CenteredSpinner />;
    }
  } else {
    return (
      <Box
        sx={{
          backgroundColor: theme.backgroundColor,
          color: theme.fontColor,
          fontFamily: theme.fontFamily,
          padding: "20px",
        }}
      >
        <Stack direction={"column"} alignItems={"center"}>
          <NovelTitle
            sx={{ fontFamily: theme.fontFamily }}
            readingNovel={reading_novel}
            novelName={novel_description_manager.novel_info.title}
          />
          <SourceComboBox
            sourceList={all_source}
            sourceValue={source}
            novelId={novelId}
            chapterId={chapterId}
            chapterPosition={chapterPosition}
            chapterTitle={reading_novel.title}
            allChapterSourceList={all_chapter_source_list}
          />
          <ControlButtons
            novelId={novelId}
            novelTitle={novel_description_manager.novel_info.title}
            readingNovel={reading_novel}
            sourceValue={source}
            chapterPosition={chapterPosition}
          />
          <NovelContent readingNovel={reading_novel} />
        </Stack>
      </Box>
    );
  }
}

export default ReadingPage;
