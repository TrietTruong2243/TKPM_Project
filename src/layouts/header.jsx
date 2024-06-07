import { AppBar, useTheme, useMediaQuery, alpha, Stack, Typography, Button, InputBase, IconButton, Box, Container } from "@mui/material"
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import "../styles/header_appearance.css"
import CategoryButton from "./components/categories_button";
import SearchButton from "./components/search_button";

export default function Header(){
    const navigate=useNavigate()
    const styles = {
        active: {
            visibility: "visible",
            transition: "all 0.5s"
        },
        hidden: {
            visibility: "hidden",
            transition: "all 0.5s",
            transform: "translateY(-100%)"
        }
    }
    const theme=useTheme();
    const isNonMobile = useMediaQuery(theme.breakpoints.up('lg'));
    const [show, setShow] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const controlNavbar = () => {
        if (window.scrollY > lastScrollY) { // if scroll down hide the navbar
            setShow(true); 
        } else if (window.scrollY < lastScrollY) { // if scroll up show the navbar
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
        style={show?styles.hidden:styles.active}
        sx={{
            boxShadow: 'none',
            height: 64,
            transition: theme.transitions.create(['height'], {
                duration: theme.transitions.duration.shorter
            }),
            
            background: alpha(theme.palette.dark.light, 1),
            ...(isNonMobile && {
                width: '100%'
            })
        }}
    >
        <Stack
            direction='row'    
            height='100%'
            width='100%'
            alignItems={'center'} 
            display={'flex'}
            flexDirection={'row'}
            spacing={8}
        >
            <Typography style={{cursor: 'pointer'}} fontSize={30} onClick={() => navigate('home')} justifyContent={'center'}>WeNovel</Typography>
            <CategoryButton/>
            <Stack direction={'row'} alignItems={'center'}>
            <SearchButton/>
            </Stack>  
            <Button onClick={() => navigate('settings')}
            >
                <Typography fontSize={20} color='white' >Settings</Typography>
            </Button>
            <Button onClick={() => navigate('history')}>
                <Typography fontSize={15} color='white' >Lịch sử</Typography>
            </Button>
        </Stack>

        </AppBar>
    )
}