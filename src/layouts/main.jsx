import { Box } from "@mui/material";

function Main({ children }) {
  return (
    <Box
      component="main"
      flexGrow={1}
      minHeight={1000}
      display="flex"
      flexDirection="column"
      py="64px"
    >
      {children}
    </Box>
  );
}
export default Main;
