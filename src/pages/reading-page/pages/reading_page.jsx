import React, { useEffect, useContext, useState } from 'react';
import { Container, Box } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ThemeContext } from '../reading_page_theme.jsx';
import NovelTitle from '../components/novel_title.jsx';
import NovelContent from '../components/novel_content.jsx';
import SourceComboBox from '../components/source_combo_box.jsx';
import ControlButtons from '../components/control_buttons.jsx';
import CenteredSpinner from '../../../components/centered_spinner.jsx';
import NovelDescriptionManager from '../../../data-manager/novel_description_manager.js';
import ReadingHistoryManager from '../../../data-manager/reading_history_manager.js';
import NovelChapterSourceList from '../../../data-manager/novel__chapter_source_change_manager.js';
import { Spinner } from 'react-bootstrap';

function ReadingPage() {
    const { state } = useLocation();
    const { theme } = useContext(ThemeContext);
    const { novelId } = useParams();
    const navigate = useNavigate();

    // Define hooks at the top level
    const [source, setSource] = useState(null);
    const [readingNovel, setReadingNovel] = useState(null);
    const [allChapter, setAllChapter] = useState(null);
    const [allSource, setAllSource] = useState(null);
    const [allChapterSourceList, setAllChapterSourceList] = useState([]);
    const [available, setAvailable] = useState(true);
    const [alertShown, setAlertShown] = useState(false);  // State to track if alert has been shown

    const novel_description_manager = NovelDescriptionManager.getInstance();
    const reading_history_manager = ReadingHistoryManager.getInstance();

    console.log(state);
    const novelSlug = novelId;
    const chapterId = state?.chapterSlug;
    const chapterPosition = state?.chapterPosition;
    console.log(chapterPosition);
    let sourceSlug = state?.sourceSlug;

    if (sourceSlug) {
        novel_description_manager.current_source = sourceSlug;
    }

    novel_description_manager.set({ novel_slug: novelId });

    useEffect(() => {
        if (!state) return;

        setAllSource(null);
        setReadingNovel(null);

        reading_history_manager.saveNewReadingNovel(novelId, chapterId);

        novel_description_manager.get().then(res => {
            setAllSource(novel_description_manager.available_source);

            if (res) {
                if (!sourceSlug) {
                    const currentSource = novel_description_manager.current_source;
                    if (currentSource) {
                        navigate(`/description/${novelId}/chapter`, {
                            state: {
                                chapterSlug: chapterId,
                                chapterPosition: chapterPosition,
                                sourceSlug: currentSource
                            }
                        });
                    }
                } else {
                    setSource(sourceSlug);
                    novel_description_manager.getChapterContent(chapterId).then((res) => {
                        if (res === null) {
                            setAvailable(false);
                        }
                        if (res !== null) {
                            setReadingNovel({ ...res, chapterId });
                            try {
                                reading_history_manager.saveNewReadingNovel(novelId, chapterId, chapterPosition, sourceSlug, novel_description_manager.novel_info, res);
                            } catch (error) {
                                console.error(error);
                            }
                        }
                    });
                }
            }
        });
    }, [chapterId]);

    useEffect(() => {
        const fetchChapterSourceList = async () => {
            setAllChapterSourceList([]);
            const chapterSourceListInstance = NovelChapterSourceList.getInstance();

            await chapterSourceListInstance.set({
                sourceList: allSource,
                novelSlug: novelId,
                chapterSlug: chapterId,
                chapterTitle: readingNovel?.title,
                chapterPosition: chapterPosition
            });

            const allDataPromises = allSource.map(async (source) => {
                const data = await chapterSourceListInstance.getChapterRelatedBySource(source.slug, source.name);
                return data;
            });

            const allData = await Promise.all(allDataPromises);

            setAllChapterSourceList(allData);
        };

        if (chapterId  && allSource) {
            fetchChapterSourceList();
        }
    }, [chapterId, readingNovel, allSource, chapterPosition]);

    useEffect(() => {
        const handleUnavailableSource = async () => {
            if (available === false && !alertShown && allChapterSourceList.length > 0) {
                alert(`Truyện từ nguồn ${sourceSlug} không khả dụng!`);
                setAlertShown(true);  // Mark the alert as shown
                let check = 0;

                for (let i = 0; i < allChapterSourceList.length; i++) {
                    alert(!allChapterSourceList[i].error)
                    if (allChapterSourceList[i].error || allChapterSourceList[i].sourceSlug === sourceSlug) {
                      
                        check++;

                    } else {
                        const selectedSource = allChapterSourceList[i];
                        alert(`Chuyển tới nguồn ${selectedSource.sourceSlug}!`);
                        navigate(`/description/${novelSlug}/chapter`, {
                            state: {
                                sourceSlug: selectedSource.sourceSlug,
                                chapterSlug: selectedSource.slug,
                                chapterPosition: selectedSource.position
                            }
                        });
                        break;
                    }
                }

                if (check === allChapterSourceList.length) {
                    alert(`Không có nguồn phù hợp`);

                    navigate(`/description/${novelSlug}`);
                }
            }
        };

        handleUnavailableSource();
    }, [available, alertShown, allChapterSourceList, navigate, novelSlug, sourceSlug]);

    if (!chapterId) {
        return <CenteredSpinner />;
    }
    console.log(allChapterSourceList)
    if (readingNovel === null) {
        if (available === false) {
            return null;  // Don't render anything if the alert has been shown and navigation is pending
        } else {
            return <CenteredSpinner />;
        }
    } else {
        return (
            <Box sx={{ backgroundColor: theme.backgroundColor, color: theme.fontColor, fontFamily: theme.fontFamily, padding: '20px' }}>
                <Container>
                    <NovelTitle sx={{ fontFamily: theme.fontFamily }} readingNovel={readingNovel} novelName={novel_description_manager.novel_info.title} />
                    <SourceComboBox sourceList={allSource} sourceValue={source} novelId={novelId} chapterId={chapterId} chapterPosition={chapterPosition} chapterTitle={readingNovel.title} allChapterSourceList={allChapterSourceList} />
                    <ControlButtons novelId={novelId} novelTitle={novel_description_manager.novel_info.title} readingNovel={readingNovel} allChapter={allChapter} sourceValue={source} chapterPosition={chapterPosition} />
                    <NovelContent readingNovel={readingNovel} />
                </Container>
            </Box>
        );
    }
}

export default ReadingPage;
