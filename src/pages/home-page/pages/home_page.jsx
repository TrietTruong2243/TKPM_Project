import {Container, Typography} from "@mui/material"
// import { alpha } from "@mui/material";
import { useTheme } from "@emotion/react"
import NovelGrid from "../novel_grid";
import NovelTable from "../novel_table";
import HotNovelManager from "../../../data-manager/hot_novels_manager";
import CenteredSpinner from "../../../components/centered_spinner";
import { useEffect, useState } from "react";
function HomePage(){
    const theme=useTheme();
    const hot_novels_manager=HotNovelManager.getInstance();
    const[hot_novels,setHotNovels]=useState([])
    const[other_sources_hot_novel,setOtherSourceHotNovel]=useState(null);
    const [loading,setLoading]=useState(true)
    useEffect(()=>{
        setLoading(true);
        hot_novels_manager.get().then(res=>{
            setHotNovels([...res]);
            setLoading(false); 
        });   
        hot_novels_manager.getOtherSourceHotNovel().then((res)=>{
            setOtherSourceHotNovel([...res]);
        })
    },[])    
    if(loading){
        return <CenteredSpinner/>
    }
    return (
        <Container >
            <Typography fontSize={20} color={theme.palette.light.main}>Truyện Hot</Typography>
            <NovelGrid novels={hot_novels}></NovelGrid>
            <NovelTable novel_data={other_sources_hot_novel}></NovelTable>
        </Container>
    )
}


export default HomePage;