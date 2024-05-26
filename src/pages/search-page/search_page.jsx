import {Container, Typography, Stack, Pagination} from "@mui/material"
import { alpha } from "@mui/material";
import { useTheme } from "@emotion/react"
import NovelGrid from "../home-page/novel_grid";
import NovelTable from "../home-page/novel_table";
import { useParams } from "react-router-dom";
import NovelCard from "../home-page/novel_card";
export default function SearchPage(){
    const theme=useTheme();
    const {category, name}=useParams()
    console.log(category,name)
    return (
        <Container>
            <NovelGrid></NovelGrid>
            <Stack 
                width={1}
                justifyContent={'center'} alignItems='center'
                >
                <Pagination count={10} color="primary"/>
            </Stack>
        </Container>
    )
}