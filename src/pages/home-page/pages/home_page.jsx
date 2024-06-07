import {Container, Typography} from "@mui/material"
// import { alpha } from "@mui/material";
import { useTheme } from "@emotion/react"
import NovelGrid from "../novel_grid";
import NovelTable from "../novel_table";
import HotNovelManager from "../../../data/hot_novels_manager";
import CenteredSpinner from "../../../spinner/centered_spinner";
import { useEffect, useState } from "react";
export default function HomePage(){
    const theme=useTheme();
    const hot_novels_manager=HotNovelManager.getInstance();
    const[hot_novels,setHotNovels]=useState([])
    const [loading,setLoading]=useState(true)
    useEffect(()=>{
        setLoading(true);
        hot_novels_manager.get().then(res=>{
            setHotNovels([...res]);
            setLoading(false); 
        });   
    },[])    
    if(loading){
        return <CenteredSpinner/>
    }
    console.log(hot_novels)
    return (
        <Container >
            <Typography fontSize={20} color={theme.palette.light.main}>Truyện Hot</Typography>
            <NovelGrid novels={hot_novels}></NovelGrid>
            <NovelTable></NovelTable>
        </Container>
    )
}