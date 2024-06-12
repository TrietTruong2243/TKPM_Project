import { Container} from "@mui/material";
import { useState,useEffect } from "react";
import NovelSourceTable from "../components/novel_source_table.jsx";
import NovelSourceManager from "../../../data-manager/novel_source_manager.js";
import CenteredSpinner from "../../../components/centered_spinner.jsx";
export default function SettingsPage(){
    let novel_source_manager=NovelSourceManager.getInstance();
    const [source_data,setSourceData]= useState([])
    const [loading,setLoading]=useState(true)
    useEffect(()=>{
        setLoading(true);
        novel_source_manager.get().then(res=>{
            setSourceData([...res]);
            setLoading(false); 
            novel_source_manager.save()
        });   
    },[])    
    if(loading){
        return <CenteredSpinner/>
    }
    return (
        <Container sx={{margin:2}}>
            <NovelSourceTable sources_data={source_data} />
        </Container>
    )
}