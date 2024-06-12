import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

const PolicyPage = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                padding: 2,
                maxWidth: '1800px', margin: '0 auto'
            }}
        >
            <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
                <Typography variant="h4" gutterBottom>Chúng tôi là ai?</Typography>
                <Typography variant="body1" gutterBottom>
                    Địa chỉ website là: http://localhost:3000, website đọc truyện online
                </Typography>

                <Divider sx={{ backgroundColor: 'white', my: 2 }} />

                <Typography variant="h4" gutterBottom>
                    Thông tin cá nhân nào bị thu thập và tại sao thu thập?
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Thông tin liên hệ
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Chúng tôi không thu thập bất cứ thông tin liên hệ nào của bạn ngoài trừ tên để bình luận
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Cookies
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Trang chí sử dụng cookies để lưu trữ hạn của quảng cáo để hiển thị số lượng nhất định, thời hạn chức năng sao lưu dữ liệu và xác thực người dùng. Chúng tôi chủ yếu sử dụng Cookie và Local Storage để lưu tên và email trong bình luận, các chương truyện bạn đã xem, bấm thích, đánh giá truyện, các bình luận của bạn, danh sách truyện yêu thích và danh sách truyện theo dõi.
                </Typography>

                <Divider sx={{ backgroundColor: 'white', my: 2 }} />

                <Typography variant="h4" gutterBottom>Chúng tôi chia sẻ dữ liệu của bạn với ai?</Typography>
                <Typography variant="body1" gutterBottom>
                    Chúng tôi không chia sẻ dữ liệu của bạn với bất kỳ ai.
                </Typography>

                <Divider sx={{ backgroundColor: 'white', my: 2 }} />

                <Typography variant="h4" gutterBottom>Dữ liệu của bạn tồn tại bao lâu?</Typography>
                <Typography variant="body1" gutterBottom>
                    Nếu bạn để lại bình luận, bình luận và siêu dữ liệu của nó sẽ được giữ lại vô thời hạn. Điều này là để chúng tôi có thể tự động nhận ra và chấp nhận bất kỳ bình luận nào thay vì giữ chúng trong khu vực đợi kiểm duyệt.
                </Typography>
            </Box>
        </Box>
    );
};

export default PolicyPage;
