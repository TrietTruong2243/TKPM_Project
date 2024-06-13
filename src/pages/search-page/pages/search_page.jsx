import {Container, Typography, Stack, Pagination} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import NovelGrid from "../../home-page/components/novel_grid";
import SearchingNovelsManager from "../../../data-manager/searching_novels_manager";
import CenteredSpinner from "../../../components/centered_spinner";

function SearchPage(){
    const queryParameters = new URLSearchParams(window.location.search)
    const keyword = queryParameters.get("keyword")||"anh"
    const navigate=useNavigate();
    const page = queryParameters.get("page")||1
    const [current_page,setCurrentPage]=useState(page);
    let searching_manager=SearchingNovelsManager.getInstance();
    const [searched_novels,setSearchedNovel]=useState([]);
    const [loading,setLoading]=useState(true);

    const handleChangePageClick=(event,value)=>{
        setCurrentPage(value)
        navigate({
            pathname:'/search',
            search:`${createSearchParams({keyword:keyword,page:value})}`,
        });
    }
    if(keyword.length<=2){
        alert('Từ khoá quá ngắn (ít nhất 3 ký tự), từ khoá mặc định là "anh"');
    }
    searching_manager.set({keyword:keyword,page:parseInt(page)})
    useEffect(()=>{
            setLoading(true);
            searching_manager.get().then(res=>{
            setSearchedNovel([...res]);
            setLoading(false);
            setCurrentPage(parseInt(searching_manager.page))
        })
    },[keyword,page])
    
    if (loading){
        return <CenteredSpinner/>;
    }
    return (
        <Container sx={{marginTop:2}}>
            <Typography fontSize={25}> Kết quả tìm kiếm </Typography>
            {(!searched_novels||searched_novels.length<=0)&&<Typography fontSize={15}> Không tìm thấy kết quả </Typography>}
            <NovelGrid novels={searched_novels}></NovelGrid>
            <Stack 
                width={1}
                justifyContent={'center'} alignItems='center'
            >
                <Pagination count={searching_manager.total_page} page={current_page} color="primary" onChange={handleChangePageClick}/>
            </Stack>
        </Container>
    )
}
export default SearchPage;