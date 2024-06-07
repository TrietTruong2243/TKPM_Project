import { ButtonGroup, Box, Container,Typography , Stack} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import * as React from "react"
import { ActionButton } from "../../../components/action_button";
import { useTheme } from "@emotion/react";
import { ArrowDownward, ArrowUpward, Visibility } from "@mui/icons-material";
import NovelSourceManager from "../../../data/novel_source_manager";
const ActionsBox = ({id, source_data,setData}) => {
    let novel_source_manager=NovelSourceManager.getInstance();
    const onMoveUp=()=>{
        if (id>1){   
            source_data[id-1].id--
            source_data[id-2].id++
            console.log(source_data)
            const temp=[...source_data]
            const moved_down_row=temp[id-2]
            temp[id-2]=temp[id-1]
            temp[id-1]=moved_down_row
            novel_source_manager.set({sources:[...temp]})
            novel_source_manager.save()
            setData([...temp])    
        }
    }
    const onMoveDown=()=>{
        console.log(id,source_data.length)
        if (id<source_data.length){
            source_data[id-1].id++
            source_data[id].id--
            console.log(source_data)
            const temp=[...source_data]
            const moved_down_row=temp[id]
            temp[id]=temp[id-1]
            temp[id-1]=moved_down_row
            novel_source_manager.set({sources:[...temp]})
            novel_source_manager.save()
            setData([...temp])
        }
    }
    return (
      <ButtonGroup component={Box}  gap={1}>
        <ActionButton small={true} bgcolor="#181818"  icon={<ArrowUpward/>} handleClick={onMoveUp}/>
        <ActionButton small bgcolor="#181818" icon={<ArrowDownward/>} handleClick={onMoveDown}/>
      </ButtonGroup>)
}

export default function NovelSourceTable({sources_data}){
    const theme=useTheme();
    const [source_data,setData]=React.useState([...sources_data])
    const columns=[
        { 
            field: 'id',
            headerName: 'Thứ tự ưu tiên',
            flex: 1.5,

        },
        { 
            field: 'baseUrl',
            headerName: 'Nguồn',
            flex: 1.5 
        },
        { 
            field: 'name',
            headerName: 'Tên nguồn',
            flex: 1.5 
        },
        {
            headerName: 'Thao tác',
            flex: 1,
            renderCell: (params) => <ActionsBox id={params.row.id} source_data={source_data} setData={setData}/>
        }
    ]
    return (
        <Container>
            <Typography fontSize={20}>
                Nguồn truyện
            </Typography>
            <Stack direction='column'  justifyContent={'space-between'} alignItems={'left'} mb={4}>
                <Box
                    minWidth={600}
                    sx={{
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: theme.palette.light.main,
                            color: theme.palette.dark.main,
                            borderBottom: "none",
                            fontSize:15
                          },
                    }}
                >
                <DataGrid
                disableRowSelectionOnClick
                rows={source_data}
                columns={columns}
                getRowId={(row) => row.id}
                sx={{
                    '& .MuiDataGrid-columnHeadersInner': {
                        bgcolor: theme.palette.light.lighter
                    },
                    '& .MuiDataGrid-row': {
                        bgcolor: theme.palette.dark.lighter,
                        color:theme.palette.light.main,
                    },
                    '& .MuiDataGrid-footerContainer': {
                        color: theme.palette.light.main,
                        bgcolor:theme.palette.dark.lighter,
                    },
                    '& .MuiDataGrid-cell:focus-within': {
                        outline: 'none',
                    },
    
                }}
              />
                </Box>
            </Stack>
        </Container>
    )
}