import NovelCard from "./novel_card";
import { hot_story } from "../../data/data";
import { Container, Grid, Stack, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";

export default function NovelGrid({hot_novel}){
    const theme=useTheme()
    return (
        <Container maxWidth='xl'>
            <Grid mb={5} container spacing={4}>
                {hot_story.map(novel => (
                    <Grid xs={2} sm={2} md={2} lg={2}  item key={novel.id}
                    display='flex'
                    width={1}
                    justifyContent='center' alignItems='center'>
                        <NovelCard novel={novel}></NovelCard>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}