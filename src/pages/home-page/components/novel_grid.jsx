import { Container, Grid} from "@mui/material";

import NovelCard from "./novel_card";

function NovelGrid({novels}){
    return (
        <Container maxWidth='xl'>
            <Grid mb={5} container spacing={4}>
                {novels.map(novel => (
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
export default NovelGrid;