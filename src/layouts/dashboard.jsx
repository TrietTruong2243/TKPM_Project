import Header from "./header";
import {Box, Stack} from "@mui/material"
import Main from "./main";
import Footer from "./footer";

export default function DashBoardLayout({children}){
    return (
        <>
            <Header> </Header>
            <Box
                sx={{
                    minHeight: 1,
                    display: 'flex',
                    flexDirection: { xs: 'column', lg: 'row'},
                }}
                >
                <Main>
                    {children}
                </Main>
            </Box>
            <Footer></Footer>
        </>
    )
}