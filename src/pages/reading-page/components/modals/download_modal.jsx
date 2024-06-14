// src/DownloadModal.js
import React, { useEffect, useState } from 'react';
import { Modal, Box, Grid, Typography, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import DownloadTypeManager from '../../../../data-manager/download_type_manager';

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
    const [selected_box, setSelectedBox] = useState(null);
    const download_manager = DownloadTypeManager.getInstance();
    const [downloadType, setDownloadType] = useState([]);
    const [is_downloading,setIsDownloading]=useState(false);
    download_manager.set({sourceSlug : sourceValue});
    useEffect(()=>{
        setSelectedBox(null)
        download_manager.reload().then(res =>{
            setDownloadType([...download_manager.get('support_types')]);
        })
    },[download_manager])
    const handleBoxClick = (boxIndex) => {
        setSelectedBox(boxIndex);
    };

    const downloadNovel = async () => {
        setIsDownloading(true);
        const extension = (downloadType.find((type)=> type.slug === selected_box)).extension
        download_manager.set({source_slug:sourceValue, 
                              format_slug:selected_box,
                              novel_slug:novelSlug, 
                              chapter_slug:chapterSlug,
                              novel_name:novelName, 
                              chapter_name:chapterName,
                              extension:extension})
        const res = await download_manager.get('file');  
        setIsDownloading(false)
        if(!res){
            alert('Định dạng hiện tại không còn được hỗ trợ !!')
        }
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
                                sx={selected_box === box.slug ? selectedBoxStyle : boxStyle}
                                textAlign="center"
                                onClick={() => handleBoxClick(box.slug)}
                            >
                                <img src={box.image} alt={box.alt} style={{ width: '50px', height: '50px' }} />
                                <Typography variant="body2">{box.extension}</Typography>
                            </Box>
                        </Grid>
                ))}
                </Grid>
                {is_downloading&&<Typography color={'white'}>Đang tải...</Typography>}
                <Box mt={4} textAlign="center">
                    <Button variant="contained" color="primary" disabled={selected_box === null} onClick={downloadNovel}>
                        Tải xuống
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default DownloadModal;
