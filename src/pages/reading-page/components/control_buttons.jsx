import React, { useState, useMemo } from 'react';
import { Box, Button, CircularProgress,Paper } from '@mui/material';
import { Home, Settings, Download } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SettingModal from './modals/setting_modal';
import { jsPDF } from 'jspdf';
import Select from 'react-select';
import { FixedSizeList as List } from 'react-window';
import DownloadModal from './modals/download_modal';
// Custom MenuList component for react-select with react-window
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

function ControlButtons({ novelId, novelTitle,readingNovel, allChapter, sourceValue }) {
    const [content] = useState(readingNovel.content);
    const story = readingNovel.title;
    const [format] = useState('pdf');
    const [showModal, setShowModal] = useState(false);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const navigate = useNavigate();
    const chapterOptions = useMemo(() => {
        return allChapter.map((chapter) => ({
        value: chapter.slug,
        label: chapter.title,
        }));
    }, [allChapter]);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const handleDownloadShow = () => setShowDownloadModal(true);
    const handleDownloadClose = () => setShowDownloadModal(false);
    if (!allChapter) {
        return(
            <Box mt={4} sx={{ border: 1 }}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CircularProgress />
                        </Box>
                    </Paper>
            </Box>
        )
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
                onClick={() => navigate(`/description/${novelId}/chapter/${readingNovel.prev_slug}?source=${sourceValue}`)}
                disabled={readingNovel.prev_slug === '#' || !readingNovel.prev_slug}
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
                    width: '400px', // Ensure the width is the same as buttons
                    height: '50px', // Maintain the same height
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
                value={chapterOptions.find(option => option.value === readingNovel.chapterId)}
                options={chapterOptions}
                onChange={(option) => navigate(`/description/${novelId}/chapter/${option.value}?source=${sourceValue}`)}
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
                onClick={() => navigate(`/description/${novelId}/chapter/${readingNovel.next_slug}?source=${sourceValue}`)}
                disabled={readingNovel.next_slug === '#' || !readingNovel.next_slug}
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
                onClick = {handleDownloadShow}
                // onClick={downloadContent}

            >
                <Download />
            </Button>
            <SettingModal show={showModal} handleClose={handleClose} />
            <DownloadModal open={showDownloadModal} handleClose={handleDownloadClose} sourceValue={sourceValue} novelSlug={novelId} novelName={novelTitle} chapterSlug={readingNovel.chapterId} chapterName={readingNovel.title}></DownloadModal>
        </Box>
    );
}

export default ControlButtons;