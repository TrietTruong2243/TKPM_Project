import { Box,Typography,tack,alpha,useTheme,useMediaQuery} from '@mui/material';
import { useEffect } from 'react';
import CopyrightIcon from '@mui/icons-material/Copyright';

export default function Footer(){
    const theme=useTheme();
    const isNonMobile = useMediaQuery(theme.breakpoints.up('lg'));
    return (
        <Box 
          component="footer"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'black',
            color: 'white',
            py: 2,
            textAlign: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
            <CopyrightIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body1">21120311_21120331_21120339_21120346_21120370</Typography>
          </Box>
          {/* <Typography variant="body1" sx={{ mb: 1 }}>Thông tin liên lạc:.....</Typography> */}
          <Typography variant="body1" sx={{ color: "white" }}>
      <a href='/policy' style={{ color: "inherit" }}>Policy Page</a>
    </Typography>        </Box>
      );
}