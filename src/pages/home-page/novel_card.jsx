import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { Box, CardContent, IconButton, Stack, Typography, alpha, useTheme } from '@mui/material';
import { redirect, useNavigate } from 'react-router-dom';


export default function NovelCard({novel}) {
    const theme = useTheme();
    const navigate=useNavigate()
    const onClick=()=>{
        navigate(`description/${novel.id}`)
    }

    return (
        <Card 
            raised
            sx={{ flex:1,  maxWidth: 150, }}
            onClick={onClick}        
        >
            <CardMedia
            sx={{ flex:1, height:200,objectFit:'contain'}}
            image={novel.image}
            title={novel.name}
            />    
            <CardContent sx={{height:20}}>
              <Typography>{novel.name}</Typography>  
            </CardContent>  
        </Card>
  );
}