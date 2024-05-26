import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import { alpha } from "@mui/material";
export default function Main({children}) {
    const theme=useTheme()
    return (
        <Box
            component='main'
            flexGrow={1}
            minHeight={1000}
            display='flex'
            flexDirection='column'
            sx={{background: alpha(theme.palette.primary.main, 0.8)}}
            py='64px'
            >
                {children}
        </Box>
    )
}