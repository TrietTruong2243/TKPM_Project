import { CssBaseline, ThemeProvider, createTheme} from "@mui/material";
import { paletteSettings } from "./palette"

export default function MyThemeProvider({children}) {

    const palette = paletteSettings();
    const theme = createTheme({
        palette: palette,
        typography: {
            fontFamily: ["Inter", "sans-serif"].join(","),
            fontSize: 12,
            h1: {
              fontFamily: ["Inter", "sans-serif"].join(","),
              fontSize: 40,
            },
            h2: {
              fontFamily: ["Inter", "sans-serif"].join(","),
              fontSize: 32,
            },
            h3: {
              fontFamily: ["Inter", "sans-serif"].join(","),
              fontSize: 24,
            },
            h4: {
              fontFamily: ["Inter", "sans-serif"].join(","),
              fontSize: 20,
            },
            h5: {
              fontFamily: ["Inter", "sans-serif"].join(","),
              fontSize: 16,
            },
            h6: {
              fontFamily: ["Inter", "sans-serif"].join(","),
              fontSize: 14,
            },
          },
          components: {
            MuiButton: {
                styleOverrides: {
                    root: {minWidth: 0}
                }
            }
          }
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}

