import { useTheme } from "@emotion/react";
import { Stack,Typography,Box, InputBase,IconButton } from "@mui/material";
import { createSearchParams, useNavigate } from "react-router-dom";
import { Search as SearchIcon} from "@mui/icons-material";
import { useState } from "react";

import { convertNameToSlug } from "../../utils/name_converter";

function SearchButton(){
    const theme=useTheme();
    const navigate=useNavigate()
    const [keyword,setKeyWord]=useState('');

    const handleSearchClick=()=>{
        if(keyword.trim().length<3){
            alert('Từ khoá quá ngắn, hãy nhập từ khoá ít nhất 3 ký tự!');
            return;
        }
        const search_key=convertNameToSlug(keyword.trim());
        navigate({
            pathname:'/search',
            search:`${createSearchParams({keyword:search_key,page:1})}`,
        });
    }

    return (
        <Stack
            direction='row'  
            alignItems={'center'} 
            display={'flex'}
            flexDirection={'row'}
            spacing={8}
        >
            <Typography fontSize={15} color='white' >Tìm kiếm</Typography>
            <Box 
                    display='flex' 
                    alignItems='center'
                    bgcolor={theme.palette.common.white}
                    borderRadius={4}
                    px={2}
                    marginLeft={2}
                    >

                        <InputBase 
                            placeholder="Tên truyện/tác giả..." 
                            id="searchName" 
                            value={keyword} 
                            onChange={(e)=>{setKeyWord(e.target.value)}}
                            sx={{
                                color: `${theme.palette.primary.main}`
                            }} />
                        <IconButton sx={{
                                        '& .MuiSvgIcon-root': {
                                            color: `${theme.palette.primary.main}`
                                        }
                                    }}
                                    onClick={()=>handleSearchClick()}
                        >
                            <SearchIcon />
                        </IconButton>
            </Box>
        </Stack>
    )
}

export default SearchButton;