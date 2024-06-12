import {Container, Typography, Stack, Pagination} from "@mui/material"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createSearchParams } from "react-router-dom";

import NovelGrid from "../../home-page/components/novel_grid";
import CenteredSpinner from "../../../components/centered_spinner";
import NovelByCategoryManager from "../../../data-manager/category_novel_manager";

function NovelByCategoryPage(){
    const query_parameters = new URLSearchParams(window.location.search)
    const {category_slug} = useParams()
    const navigate=useNavigate();
    const page = query_parameters.get("page")||1
    const [current_page,setCurrentPage]=useState();
    let novel_category_manager=NovelByCategoryManager.getInstance();
    const [category_novels,setCategoryNovel]=useState([]);
    const [loading,setLoading]=useState(true);

    const handleChangePageClick=(event,value)=>{
        setCurrentPage(value)
        navigate({
            pathname:`/category/${category_slug}`,
            search:`${createSearchParams({page:value})}`,
        });
    }

    novel_category_manager.set({category:category_slug,page:parseInt(page)})
    useEffect(()=>{
            setLoading(true);
            novel_category_manager.get().then(res=>{
            setCategoryNovel([...res]);
            setLoading(false);
            setCurrentPage(parseInt(novel_category_manager.page))
        })
    },[category_slug,page])


    if (loading){
        return <CenteredSpinner/>;
    }
    return (
        <Container sx={{marginTop:2}}>
            <Typography fontSize={25}> Kết quả tìm kiếm </Typography>
            {(!category_novels||category_novels.length<=0)&&<Typography fontSize={15}> Không tìm thấy kết quả </Typography>}
            <NovelGrid novels={category_novels}></NovelGrid>
            <Stack 
                width={1}
                justifyContent={'center'} alignItems='center'
            >
                <Pagination count={novel_category_manager.total_page} page={current_page} color="primary" onChange={handleChangePageClick}/>
            </Stack>
        </Container>
    )
}

export default NovelByCategoryPage;