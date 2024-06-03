import { ButtonGroup, Box, Container,Typography , Stack} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ActionButton } from "../../components/action_button";
import { useTheme } from "@emotion/react";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
const ActionsBox = ({id, source_data}) => {
    const onMoveUp=()=>{
        if (id>1){
            source_data[id-2].id++;
            source_data[id-1].id--;            
        }
    }
    const onMoveDown=({id})=>{
        if (id<source_data.length-1){

        }
    }
    return (
      <ButtonGroup component={Box}  gap={1}>
        <ActionButton small={true} bgcolor="#181818"  icon={<ArrowUpward/>} handleClick={onMoveUp}/>
        <ActionButton small bgcolor="#181818" icon={<ArrowDownward/>} handleClick={onMoveDown}/>
      </ButtonGroup>)
}

export default function NovelSourceTable({source_data}){
    const theme=useTheme();
    const onMoveUp=({id})=>{
        console.log(id)
    }
    const onMoveDown=({id})=>{

    }
    const columns=[
        { 
            field: 'id',
            headerName: 'Thứ tự ưu tiên',
            flex: 1.5,

        },
        { 
            field: 'sourcepath',
            headerName: 'Nguồn',
            flex: 1.5 
        },
        { 
            field: 'sourcename',
            headerName: 'Tên nguồn',
            flex: 1.5 
        },
        {
            headerName: 'Action',
            flex: 1,
            renderCell: (params) => <ActionsBox id={params.row.id} source_data={source_data} />
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