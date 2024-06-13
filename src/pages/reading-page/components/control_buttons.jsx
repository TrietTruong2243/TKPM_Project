import React, { useState, useMemo, useEffect } from 'react';
import { Box, Button, CircularProgress, Paper } from '@mui/material';
import { Home, Settings, Download } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SettingModal from './modals/setting_modal';
import Select from 'react-select';
import { FixedSizeList as List } from 'react-window';
import DownloadModal from './modals/download_modal';
import NovelDescriptionManager from '../../../data-manager/novel_description_manager';
import { Spinner } from 'react-bootstrap';

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

function ControlButtons({ novelId, novelTitle, readingNovel, sourceValue, chapterPosition }) {
    const [content] = useState(readingNovel.content);
    const [showModal, setShowModal] = useState(false);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const navigate = useNavigate();
    const instance = NovelDescriptionManager.getInstance();
    const [meta, setMeta] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [allChapter, setAllChapter] = useState([]);

    const chapterOptions = useMemo(() => {
        if (allChapter.length === 0) return [];
        setIsLoading(false);

        return allChapter.map((chapter) => ({
            slug: chapter.slug,
            label: chapter.title,
            position: chapter.position
        }));
    }, [allChapter]);

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
                console.error('Failed to fetch meta:', error);
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
                console.error('Failed to fetch chapters:', error);
            } finally {
                // setIsLoading(false);
            }
        };

        fetchChapters();
    }, [meta, chapterPosition, instance]);

    if (isLoading) {
        return <Spinner animation="border" role="status" />;
    }

    return (
        <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
            <Button
                className="btn-custom"
                sx={{
                    backgroundColor: '#444',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#666' },
                    margin: '0 8px',
                    width: '48px',
                    height: '48px',
                    minWidth: '48px',
                }}
                onClick={() => navigate(`/home`)}
            >
                <Home />
            </Button>
            <Button
                className="btn-custom"
                sx={{
                    backgroundColor: '#444',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#666' },
                    margin: '0 8px',
                    width: '48px',
                    height: '48px',
                    minWidth: '48px',
                }}
                onClick={() => navigate(`/description/${novelId}/chapter`, {
                    state: {
                        chapterSlug: readingNovel.prev_slug,
                        chapterPosition: chapterPosition - 1,
                        sourceSlug: sourceValue
                    }
                })}
                disabled={!readingNovel.prev_slug || readingNovel.prev_slug === '#'}
            >
                &laquo;
            </Button>
            <Select
                components={{ MenuList }}
                styles={{
                    control: (base) => ({
                        ...base,
                        color: '#FFF',
                        backgroundColor: '#444',
                        width: '400px',
                        height: '50px',
                    }),
                    menu: (base) => ({
                        ...base,
                        color: '#FFF',
                        backgroundColor: '#444',
                    }),
                    singleValue: (base) => ({
                        ...base,
                        color: '#FFF',
                    }),
                }}
                value={chapterOptions.find(option => option.slug === readingNovel.chapterId)}
                options={chapterOptions}
                onChange={(option) => navigate(`/description/${novelId}/chapter`, {
                    state: {
                        chapterSlug: option.slug,
                        chapterPosition: option.position,
                        sourceSlug: sourceValue
                    }
                })}
            />
            <Button
                className="btn-custom"
                sx={{
                    backgroundColor: '#444',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#666' },
                    margin: '0 8px',
                    width: '48px',
                    height: '48px',
                    minWidth: '48px',
                }}
                onClick={() => navigate(`/description/${novelId}/chapter`, {
                    state: {
                        chapterSlug: readingNovel.next_slug,
                        chapterPosition: chapterPosition + 1,
                        sourceSlug: sourceValue
                    }
                })}
                disabled={!readingNovel.next_slug || readingNovel.next_slug === '#'}
            >
                &raquo;
            </Button>
            <Button
                className="btn-custom"
                sx={{
                    backgroundColor: '#444',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#666' },
                    margin: '0 8px',
                    width: '48px',
                    height: '48px',
                }}
                onClick={handleShow}
            >
                <Settings />
            </Button>
            <Button
                className="btn-custom"
                sx={{
                    backgroundColor: '#444',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#666' },
                    margin: '0 8px',
                    width: '48px',
                    height: '48px',
                }}
                onClick={handleDownloadShow}
            >
                <Download />
            </Button>
            <SettingModal show={showModal} handleClose={handleClose} />
            <DownloadModal open={showDownloadModal} handleClose={handleDownloadClose} sourceValue={sourceValue} novelSlug={novelId} novelName={novelTitle} chapterSlug={readingNovel.chapterId} chapterName={readingNovel.title} />
        </Box>
    );
}

export default ControlButtons;
