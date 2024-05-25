import { Margin, Padding } from "@mui/icons-material";
import { useState } from "react";
import { Container, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";


export default function CategoryButton({categories_data}){
    const navigate=useNavigate()
    const [drop_down_menu_visibility,setDropDownMenuVisibility]=useState(false)
    const onMouseEnter=()=>{
        setDropDownMenuVisibility(true)
    }
    const onMouseLeave=()=>{
        setDropDownMenuVisibility(false)
    }
    const onClick=({id})=>{
        //navigate(`home/${id}`)
    }
    return (
        <Dropdown>
            <Dropdown.Toggle variant="success"  id= 'dropdown-basic' onMouseEnter={onMouseEnter}>
                Thể loại
            </Dropdown.Toggle>
            <Container onMouseLeave={onMouseLeave}>
                {drop_down_menu_visibility && <Dropdown.Menu>
                    <Grid mb={5} container spacing={4}>
                {categories_data.map(cate => (
                    <Grid xs={2} sm={2} md={2} lg={2}  item key={cate.id}
                    display='flex'
                    width={1}
                    justifyContent='center' alignItems='center'>
                        <Dropdown.Item color="white" onClick={onClick(cate.id)}>{cate.name}</Dropdown.Item>
                    </Grid>
                ))}
            </Grid>
            </Dropdown.Menu>}
            </Container>
        </Dropdown>
    )
}