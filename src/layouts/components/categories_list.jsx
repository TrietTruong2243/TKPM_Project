import React, { useState } from 'react'; 
import { Grid ,Button} from '@mui/material';
import { Container } from 'react-bootstrap';

function CategoryDropdownList({categories_data,handleMouseLeave}) { 
  return ( 
    <Container  
        onMouseLeave={handleMouseLeave}
        style={{background:'white', 
                borderRadius:5, 
                position:'absolute',
                marginTop:250,
                marginLeft:150,
                height:200, 
                width:550, 
                gridColumn:12,
                overflow:'auto'}}  
    > 
      <Grid mb={1} container spacing={1}>
          {categories_data.map(category => ( 
            <Grid xs={3} sm={3} md={3} lg={3} item key={category.slug}
                display='flex'>        
                <Button  key={category.slug} onClick={()=> console.log(category.name)} > 
                    {category.name} 
                </Button> 
            </Grid>
          ))} 
      </Grid>
    </Container> 
  ); 
} 
 
export default CategoryDropdownList;