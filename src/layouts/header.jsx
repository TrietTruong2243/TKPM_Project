import {AppBar, useTheme,useMediaQuery,alpha, Stack, Typography,Button, InputBase, IconButton, Box, Container} from "@mui/material"
import {Search as SearchIcon, ArrowDownwardRounded, ArrowDropDown, Layers} from "@mui/icons-material"
import { useState,useEffect } from "react";
import "../styles/header_appearance.css"
import { categories_data } from "../data/data";
export default function Header(){
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
        if (window.scrollY > lastScrollY+50) { // if scroll down hide the navbar
            setShow(true); 
        } else if (window.scrollY < lastScrollY-50 || Window.scrollY-50<0) { // if scroll up show the navbar
            setShow(false);  
        }
        console.log(show)
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
            <Typography fontSize={30}   justifyContent={'center'}>WeNovel</Typography>
            <IconButton sx={{
                            '& .MuiSvgIcon-root': {
                                color: 'white'
                            }
                        }}>
                <Typography fontSize={15} color='white' >Thể loại</Typography>
                <ArrowDropDown color='white'/>
            </IconButton>
            <Stack direction={'row'} alignItems={'center'}>
            <Typography fontSize={15} color='white' >Tìm kiếm</Typography>
            <Box display='flex' alignItems='center'
                    bgcolor={theme.palette.common.white}
                    borderRadius={4}
                    px={2}
                    marginLeft={2}
                    >

                        <InputBase placeholder="Tìm kiếm..."
                        sx={{
                            color: `${theme.palette.primary.main}`
                        }}/>
                        <IconButton sx={{
                            '& .MuiSvgIcon-root': {
                                color: `${theme.palette.primary.main}`
                            }
                        }}>
                            <SearchIcon/>
                        </IconButton>
            </Box>  
            </Stack>  
            <Button>
                <Typography fontSize={15} color='white' >Settings</Typography>
            </Button>   
            <Button >
                <Typography fontSize={15} color='white' >Lịch sử</Typography>
            </Button>       
        </Stack>

    </AppBar>
    )
}