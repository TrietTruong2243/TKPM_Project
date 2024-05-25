import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { noveltable_data } from "../../data/data";
import { useTheme } from "@emotion/react";
const columns=[
    { 
        field: 'category',
        headerName: 'Thể loại',
        flex: 0.5 ,
        sortable:false,
    },
    { 
        field: 'name',
        headerName: 'Tên',
        flex: 1 ,
        sortable:false,
    },
    { 
        field: 'new_chapter',
        headerName: 'Chương mới nhất',
        flex: 1 ,
        sortable:false,
    },
    { 
        field: 'trans',
        headerName: 'Nhóm dịch',
        flex: 1 ,
        sortable:false,
    },
    { 
        field: 'time',
        headerName: 'Thời gian',
        flex: 1 ,
        sortable:false,
    },
    
]
export default function NovelTable({novel_data}){
    const theme=useTheme()
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
            rows={noveltable_data}
            columns={columns}
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
                    color: theme.palette.dark.lighter,
                    bgcolor:theme.palette.light.main,
                },
                '& .MuiDataGrid-cell:focus-within': {
                    outline: 'none',
                },

            }}
          />
        </Box>
      );
}