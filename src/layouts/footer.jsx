import {Typography, Stack,alpha,useTheme,useMediaQuery} from '@mui/material';
import { useEffect } from 'react';

export default function Footer(){
    const theme=useTheme();
    const isNonMobile = useMediaQuery(theme.breakpoints.up('lg'));
    return (
        <footer
            style={{
                boxShadow: 'none',
                height: 64,
                transition: theme.transitions.create(['height'], {
                    duration: theme.transitions.duration.shorter
                }),
                background: alpha(theme.palette.primary.main, 0.9),
                ...(isNonMobile && {
                    width: '100%'
                }),             
            }}
        >
            <Stack
                direction='row'
                color='white'
            >
                <Typography>Footer</Typography>
            </Stack>
    
        </footer>
        )
}