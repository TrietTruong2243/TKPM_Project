import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import {  CardContent,Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';


function NovelCard({novel}) {
    const default_image="images/unkowm_novel.png";
    const image=novel.image?novel.image:default_image;
    const navigate=useNavigate();
    const onClick=()=>{
        navigate(`/description/${novel.slug}`)
    }

    return (
        <Card 
            raised
            sx={{ flex:1,  maxWidth: 150, }}
            onClick={onClick}        
        >
            <CardMedia
            sx={{ flex:1, height:200,objectFit:'contain'}}
            image={image}
            title={novel.title}
            />    
            <CardContent sx={{height:100}}>
                <Typography>{novel.title}</Typography>  
            </CardContent>  
        </Card>
  );
}

export default NovelCard;