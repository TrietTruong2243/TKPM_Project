import { Box,Typography,useTheme} from '@mui/material';
import CopyrightIcon from '@mui/icons-material/Copyright';

export default function Footer(){
   
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
            <Typography variant="body1" sx={{ color: "white" }}>
                <a href='/policy' style={{ color: "inherit" }}>Policy Page</a>
            </Typography>        
        </Box>
        );
}