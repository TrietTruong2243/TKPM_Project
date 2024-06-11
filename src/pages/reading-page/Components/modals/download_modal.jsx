// src/DownloadModal.js
import React, { useEffect, useState } from 'react';
import { Modal, Box, Grid, Typography, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadTypeManager from '../../../../data/download_type_manager';
import CenteredSpinner from '../../../../spinner/centered_spinner';
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  outline: 0,
};

const boxStyle = {
  cursor: 'pointer',
  padding: '10px',
  borderRadius: '5px',
  border: '2px solid transparent',
  width: '100px', // Fixed width
  height: '120px', // Fixed height
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

const selectedBoxStyle = {
  ...boxStyle,
  borderColor: '#3f51b5', // Highlight color
  backgroundColor: '#f0f0f0',
};

const DownloadModal = ({ open, handleClose, sourceValue, novelSlug, novelName,  chapterSlug, chapterName }) => {
  const [selectedBox, setSelectedBox] = useState(null);
  console.log(novelName + " " + chapterName)
  const downloadManager = DownloadTypeManager.getInstance();
  const [downloadType, setDownloadType] = useState([]);
  downloadManager.set({sourceSlug : sourceValue});
  useEffect(()=>{
    setSelectedBox(null)
    downloadManager.get().then(res =>{
      setDownloadType([...res]);
    })
  },[downloadManager])
  const handleBoxClick = (boxIndex) => {
    setSelectedBox(boxIndex);
  };

  const downloadNovel = async () => {
        const extension = (downloadType.find((type)=> type.slug === selectedBox)).extension
    const res = await downloadManager.downloadNovel(sourceValue, selectedBox,novelSlug,chapterSlug,novelName,chapterName,extension);
 
  };
  if (!downloadType){
    return 
  }
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <IconButton
          sx={{ position: 'absolute', top: 8, right: 8 }}
          onClick={handleClose}
        >
          <CloseIcon sx={{color: 'white'}} />
        </IconButton>
        <Grid container spacing={2} justifyContent="center">
          {downloadType.map((box) => (
            <Grid item key={box.slug}>
              <Box
                sx={selectedBox === box.slug ? selectedBoxStyle : boxStyle}
                textAlign="center"
                onClick={() => handleBoxClick(box.slug)}
              >
                <img src={box.image} alt={box.alt} style={{ width: '50px', height: '50px' }} />
                <Typography variant="body2">{box.extension}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box mt={4} textAlign="center">
          <Button variant="contained" color="primary" disabled={selectedBox === null} onClick={downloadNovel}>
            Tải xuống
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DownloadModal;
