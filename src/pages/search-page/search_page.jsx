import {Container, Typography, Stack, Pagination} from "@mui/material"
import NovelGrid from "../home-page/novel_grid";
import { hot_story } from "../../data/data";
import SearchingNovelsManager from "../../data/searching_novels_manager";
import { useEffect, useState } from "react";
import CenteredSpinner from "../../spinner/centered_spinner";
import { useNavigate } from "react-router-dom";
import { createSearchParams } from "react-router-dom";
export default function SearchPage(){
    const queryParameters = new URLSearchParams(window.location.search)
    const keyword = queryParameters.get("keyword")
    const navigate=useNavigate();
    const page = queryParameters.get("page")
    let searching_manager=SearchingNovelsManager.getInstance();
    const [searched_novels,setSearchedNovel]=useState([]);
    const [loading,setLoading]=useState(true);
    const handleChangePageClick=(event,value)=>{
        navigate({
            pathname:'/search',
            search:`${createSearchParams({keyword:keyword,page:value})}`,
        });
    }
    searching_manager.set({keyword:keyword,page:page})
    useEffect(()=>{
            setLoading(true);
            searching_manager.get().then(res=>{
            setSearchedNovel([...res]);
            setLoading(false);
        })
    },[keyword,page])
    if (loading){
        return <CenteredSpinner/>;
    }
    return (
        <Container sx={{marginTop:2}}>
            <Typography fontSize={25}> Kết quả tìm kiếm </Typography>
            <NovelGrid novels={searched_novels}></NovelGrid>
            <Stack 
                width={1}
                justifyContent={'center'} alignItems='center'
            >
                <Pagination count={searching_manager.total_page} color="primary" onChange={handleChangePageClick}/>
            </Stack>
        </Container>
    )
}