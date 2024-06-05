import { Container,ButtonGroup,Box } from "@mui/material";
import NovelSourceTable from "./novel_source_table.jsx";
import NovelSourceManager from "../../data/NovelSourceManager.js";
export default function SettingsPage(){
    let novel_source_manager=NovelSourceManager.getInstance();
    let source_data=novel_source_manager.getSource();
    novel_source_manager.saveSourceWithPriority(source_data)
    return (
        <Container sx={{margin:2}}>
            <NovelSourceTable sources_data={source_data} />
        </Container>
    )
}