import { IconButton,Typography } from "@mui/material"
import { ArrowDropDown } from "@mui/icons-material"
import CategoryDropdownList from "./categories_list"
import { useState } from "react"
export default function CategoryButton(){
    const [show,setShow]=useState(false);
    const handleMouseEnter=()=>{
        setShow(true)
    }
    const handleMouseLeave=()=>{
        setShow(false)
    }
    return (
        <IconButton 
            onMouseEnter={handleMouseEnter}
        sx={{
            '& .MuiSvgIcon-root': {
                color: 'white'
            },
            position:'relative'
        }}>
            <Typography fontSize={15} color='white' >Thể loại</Typography>
            <ArrowDropDown color='white'/>
            {show&&<CategoryDropdownList handleMouseLeave={handleMouseLeave}/>}
        </IconButton>
    )
}