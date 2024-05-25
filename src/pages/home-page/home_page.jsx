import {Container, Typography} from "@mui/material"
import { alpha } from "@mui/material";
import { useTheme } from "@emotion/react"
import NovelGrid from "./novel_grid";
import NovelTable from "./novel_table";
export default function HomePage(){
    const theme=useTheme();
    return (
        <Container>
            <NovelGrid></NovelGrid>
            <NovelTable></NovelTable>
        </Container>
    )
}