import {AppBar, useTheme,useMediaQuery,alpha, Stack, Typography} from "@mui/material"
import { useState,useEffect } from "react";
import "../styles/header_appearance.css"
export default function Header(){
    const theme=useTheme();
    const isNonMobile = useMediaQuery(theme.breakpoints.up('lg'));
    const [show, setShow] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const controlNavbar = () => {
        if (window.scrollY > lastScrollY) { // if scroll down hide the navbar
            setShow(true); 
        } else { // if scroll up show the navbar
            setShow(false);  
        }
        setLastScrollY(window.scrollY); 
    };

    useEffect(() => {
        window.addEventListener('scroll', controlNavbar);

        // cleanup function
        return () => {
            window.removeEventListener('scroll', controlNavbar);
        };
    }, [lastScrollY]);

    return (
    <AppBar
        className={`active ${show && 'hidden'}`}
        sx={{
            boxShadow: 'none',
            height: 64,
            transition: theme.transitions.create(['height'], {
                duration: theme.transitions.duration.shorter
            }),
            background: alpha(theme.palette.primary.main, 0.8),
            ...(isNonMobile && {
                width: '100%'
            })
        }}
    >
        <Stack
            direction='row'
        >
            <Typography>App bar</Typography>
        </Stack>

    </AppBar>
    )
}