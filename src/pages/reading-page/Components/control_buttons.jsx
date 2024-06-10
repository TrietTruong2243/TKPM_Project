import React, { useState, useMemo } from 'react';
import { Box, Select, MenuItem, Button, FormControl, InputLabel } from '@mui/material';
import { Home, Settings, Download } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SettingModal from './setting_modal';
import { jsPDF } from 'jspdf';

export default function ControlButtons({ novelId, readingNovel, allChapter,sourceValue }) {
  // const { theme } = useContext(ThemeContext);
  const [content] = useState(readingNovel.content);
  const story = readingNovel.title;
  const [format] = useState('pdf');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const downloadContent = () => {
    let blob;
    let fileExtension;
    if (format === 'html') {
      blob = new Blob([content], { type: 'text/html' });
      fileExtension = 'html';
    }else if (format === 'pdf') {
      const doc = new jsPDF();
      doc.setFont('Times', 'Roman');
      const textContent = content.replace(/<\/?[^>]+(>|$)/g, ""); // Strip HTML tags
      const lines = doc.splitTextToSize(textContent, 180); // Split text to fit the page width
      doc.text(lines, 10, 10);
      doc.save(`${story}.pdf`);
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${story}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  const chapterOptions = useMemo(() => {
    return allChapter.map((chapter) => (
      <MenuItem
        key={chapter.slug}
        value={chapter.slug}
        onClick={() => navigate(`/description/${novelId}/chapter/${chapter.slug}?source=${sourceValue}`)}
      >
        {chapter.title}
      </MenuItem>
    ));
  }, [allChapter, navigate, novelId]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  if (!allChapter) {
    return <div>Loading...</div>;
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
        disabled={readingNovel.prev_slug === '#'|| !readingNovel.prev_slug}
      >
        &laquo;
      </Button>
      <FormControl variant="outlined" sx={{ width: '50%' }}>
        <Select
          sx={{ color: '#FFF', backgroundColor: '#444' }}
          labelId="chapter-label"
          id="chapterSelect"
          label="Chương"
          value={readingNovel.chapterId}
        >
          {chapterOptions}
        </Select>
      </FormControl>
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
        onClick={downloadContent}
      >
        <Download />
      </Button>
      <SettingModal show={showModal} handleClose={handleClose} />
    </Box>
  );
}
