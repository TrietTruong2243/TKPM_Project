import {Button, Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@emotion/react";
import { isOverflown } from "@mui/x-data-grid/utils/domUtils";
import { useNavigate } from "react-router-dom";
import CenteredSpinner from "../../../components/centered_spinner";
const columns=[
    { 
        field: 'title',
        headerName: 'Tên',
        flex: 1.5 ,
        sortable:false,
    },
    { 
        field: 'status',
        headerName: 'Trạng thái',
        flex: 1 ,
        sortable:false,
    },
    { 
        field: 'num_chapters',
        headerName: 'Số chương',
        flex: 0.5 ,
        sortable:false,
    },
    { 
        field: 'authors',
        headerName: 'Tác giả',
        flex: 1 ,
        sortable:false,
        renderCell: (params) =>params.row.authors.map(item=><Typography color={'white'}>{item.name}</Typography>),
    },
    { 
        field: 'categories',
        headerName: 'Thể loại',
        flex: 1.5 ,
        sortable:false,
        renderCell: (params) =>params.row.categories.map(item=><Typography marginLeft={1} color={'white'}>{item.name}</Typography>),
    }    
]
function NovelTable({novel_data}){
    const theme=useTheme()
    const navigate=useNavigate();
    const handleRowClick=(params)=>{
        navigate(`/description/${params.row.slug}`)
    }
    if(!novel_data){
        return <CenteredSpinner/>
    }
    return (
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
            rows={novel_data}
            columns={columns}
            getRowId={(row) => row.slug}
            onRowClick={handleRowClick}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
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
      );
}

export default NovelTable;