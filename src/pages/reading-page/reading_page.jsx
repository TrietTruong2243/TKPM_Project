import React from 'react';
import { Container, Typography, Box, Select, MenuItem, Button, IconButton, FormControl, InputLabel } from '@mui/material';
import { Home, Settings, Download } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { Navigate, useNavigate } from "react-router-dom";

const readingNovel  = {
  title: "Tổng phim ảnh, Tổng so vai chính bởi cận đại",
  author: "Cố Thương Lâm An",
  allChapter: 100,
  presentChapter: 85,
  content: " Ở nam tôn nữ tỉ thế giới, Võ Tắc Thiên như vậy nữ tử có thể chỉ có một, có người nói còn có thượng quan Uyển Nhi đâu, ha hả, nếu không có Võ Tắc Thiên, nàng cũng chỉ có thể mãn nhiên với tiểu thư khuê các bên trong, cho dù có lại cao tài học lại như thế nào? Lại hoặc là, Võ Tắc Thiên không có thể đi vào hậu cung, như thế nào dùng có thể thăng cư địa vị cao? <br/>   <br/>        Vận mệnh nha! Ba phần thiên chú định, bảy phần dựa dốc sức làm. <br/> <br/> Nhưng nếu không có kia ba phần trời cao duyên phận, lại như thế nào nỗ lực cũng là tốn công vô ích.<br>   <br/>          Có thể trở thành thọ vương phi, trừ bỏ tài nghệ dung mạo, cũng sau lưng gia tộc cũng là phần không mở ra. <br> <br/> Mặc dù nàng cha mẹ song vong, là cái để gãi mồ côi, ám, nếu nàng không phải bé gái mồ côi, Đại Đường hoàng thất còn không nhất định có thể cưới đến thế giới đệ nhất mỹ nữ, ha hả, thật đúng là châm chọc, đường đường hoàng thất, cư nhiên cũng lấy cưới thế gia nữ vì vinh. <br> <br/>Mỹ nhân nhà mỹ nhân, từ đại mỹ nữ cũng hào, mười đại mỹ nhân cũng thế, nếu không có sau lưng chuyện xưa, so với bọn hắn đẹp hơn là có khỏi người đi? Có thể thấy được này thân phận vẫn là cần thiết. "
}
const App = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ backgroundColor: '#000', color: '#fff', fontFamily: 'Arial, sans-serif', minHeight: '100vh', padding: '20px' }}>
      <Container>
        <Typography variant="h1" align="center" gutterBottom>
          Tổng phim ảnh, Tổng so vai chính bởi cận đại
        </Typography>
        <Typography variant="h6" align="center" gutterBottom>
          Cố Thương Lâm An
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
          <Typography variant="body1" mr={1}>
            Nguồn:
          </Typography>
          <FormControl variant="outlined" sx={{ width: '50%' }}>
            <InputLabel id="nguon-label">Nguồn</InputLabel>
            <Select labelId="nguon-label" id="nguonSelect" defaultValue="Tàng thư viện" label="Nguồn">
              <MenuItem value="Tàng thư viện">Tàng thư viện</MenuItem>
            </Select>
          </FormControl>
        </Box>
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
              minWidth: '48px'

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
              minWidth: '48px'
            }}
          >
            &laquo;
          </Button>
          <FormControl variant="outlined" sx={{ width: '50%' }}>
            <InputLabel id="chapter-label">Chương</InputLabel>
            <Select labelId="chapter-label" id="chapterSelect" defaultValue="Chương 95" label="Chương">
              <MenuItem value="Chương 1">Chương 1</MenuItem>
              <MenuItem value="Chương 2">Chương 2</MenuItem>
              <MenuItem value="Chương 3">Chương 3</MenuItem>
              <MenuItem value="Chương 95">Chương 95</MenuItem>
              {/* Thêm các chương khác tại đây */}
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
              minWidth: '48px'
            }}
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
              height: '48px'
            }}
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
              height: '48px'
            }}
          >
            <Download />
          </Button>
        </Box>
        <Box>
        <Typography variant ="h3" paragraph dangerouslySetInnerHTML={{ __html: readingNovel.content }} />

        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
          {/* <Button
            className="btn-custom"
            sx={{
              backgroundColor: '#444',
              color: '#fff',
              '&:hover': { backgroundColor: '#666' },
              margin: '0 8px',
              width: '48px',
              height: '48px',
              minWidth: '48px'

            }}
          >
            <Home />
          </Button> */}
          <Button
            className="btn-custom"
            sx={{
              backgroundColor: '#444',
              color: '#fff',
              '&:hover': { backgroundColor: '#666' },
              margin: '0 8px',
              width: '48px',
              height: '48px',
              minWidth: '48px'
            }}
          >
            &laquo;
          </Button>
          <FormControl variant="outlined" sx={{ width: '50%' }}>
            <InputLabel id="chapter-label">Chương</InputLabel>
            <Select labelId="chapter-label" id="chapterSelect" defaultValue="Chương 95" label="Chương">
              <MenuItem value="Chương 1">Chương 1</MenuItem>
              <MenuItem value="Chương 2">Chương 2</MenuItem>
              <MenuItem value="Chương 3">Chương 3</MenuItem>
              <MenuItem value="Chương 95">Chương 95</MenuItem>
              {/* Thêm các chương khác tại đây */}
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
              minWidth: '48px'
            }}
          >
            &raquo;
          </Button>
          {/* <Button
            className="btn-custom"
            sx={{
              backgroundColor: '#444',
              color: '#fff',
              '&:hover': { backgroundColor: '#666' },
              margin: '0 8px',
              width: '48px',
              height: '48px'
            }}
          >
            <Settings />
          </Button> */}
          {/* <Button
            className="btn-custom"
            sx={{
              backgroundColor: '#444',
              color: '#fff',
              '&:hover': { backgroundColor: '#666' },
              margin: '0 8px',
              width: '48px',
              height: '48px'
            }}
          >
            <Download />
          </Button> */}
        </Box>
      </Container>
    </Box>
  );
};

export default App;
