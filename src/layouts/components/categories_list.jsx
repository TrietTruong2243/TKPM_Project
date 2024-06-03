import React, { useState } from 'react'; 
import { categories_data } from '../../data/data'; 
import { Grid ,Button} from '@mui/material';
import { Container } from 'react-bootstrap';
function CategoryDropdownList({handleMouseLeave}) { 
  return ( 
    <Container  
        onMouseLeave={handleMouseLeave}
        style={{background:'white', borderRadius:5, position:'absolute',marginTop:250,height:200, width:400, gridColumn:12}}  
    > 
    <Grid mb={1} container spacing={1}>
      {categories_data.map(category => ( 
        <Grid xs={3} sm={3} md={3} lg={3} item key={category.id}
            display='flex'>        
            <Button  key={category.id} onClick={()=> console.log(category.name)} > 
                {category.name} 
            </Button> 
        </Grid>
      ))} 
    </Grid>
    </Container> 
  ); 
} 
 
export default CategoryDropdownList;