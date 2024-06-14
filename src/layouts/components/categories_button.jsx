import { IconButton,Typography } from "@mui/material"
import { ArrowDropDown } from "@mui/icons-material"
import { useEffect, useState } from "react"

import CategoryDropdownList from "./categories_list"
import CategoryManager from "../../data-manager/category_manager"

function CategoryButton(){

    const category_manager=CategoryManager.getInstance();
    const [categories_data,setCategoryData]= useState([])
    const [loading,setLoading]=useState(true)
    const [show,setShow]=useState(false);

    const handleMouseEnter=()=>{
        setShow(true)
    }
    const handleMouseLeave=()=>{
        setShow(false)
    }

    useEffect(()=>{
        setLoading(true);
        category_manager.reload().then(()=>{
            let categories=category_manager.get('categories_list');
            if(categories!==null){
                setCategoryData([...categories]);
                setLoading(false);
            }
        })
    },[])
    return (
        <IconButton 
            onMouseEnter={handleMouseEnter}
            sx={{
                '& .MuiSvgIcon-root': {
                    color: 'white'
                },
                position:'relative'
            }}
        >
            <Typography fontSize={15} color='white' >Thể loại</Typography>
            <ArrowDropDown color='white'/>
            {show&&<CategoryDropdownList handleMouseLeave={handleMouseLeave} categories_data={categories_data} loading={loading}/>}
        </IconButton>
    )
}

export default CategoryButton;