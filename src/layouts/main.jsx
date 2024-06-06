import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
export default function Main({children}) {
    const theme=useTheme()
    return (
        <Box
            component='main'
            flexGrow={1}
            minHeight={1000}
            display='flex'
            flexDirection='column'
            py='64px'
            >
                {children}
        </Box>
    )
}