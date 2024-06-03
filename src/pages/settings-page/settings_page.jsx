import { Container,ButtonGroup,Box } from "@mui/material";
import NovelSourceTable from "./novel_source_table.jsx";
import { ActionButton } from "../../components/action_button";
import { source_data } from "../../data/data";

export default function SettingsPage(){

    return (
        <Container sx={{margin:2}}>
            <NovelSourceTable sources_data={source_data}/>
        </Container>
    )
}