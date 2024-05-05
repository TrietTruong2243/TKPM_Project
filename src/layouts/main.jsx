import { Box } from "@mui/material";

export default function Main({children}) {

    return (
        <Box
            component='main'
            flexGrow={1}
            minHeight={1}
            display='flex'
            flexDirection='column'
            py='82px'>
                {children}
        </Box>
    )
}