import {
  AppBar,
  useTheme,
  useMediaQuery,
  alpha,
  Stack,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/header_appearance.css";
import CategoryButton from "./components/categories_button";
import SearchButton from "./components/search_button";

function Header() {
  const navigate = useNavigate();
  const styles = {
    active: {
      visibility: "visible",
      transition: "all 0.5s",
    },
    hidden: {
      visibility: "hidden",
      transition: "all 0.5s",
      transform: "translateY(-100%)",
    },
  };
  const theme = useTheme();
  const is_non_mobile = useMediaQuery(theme.breakpoints.up("lg"));
  const [show, setShow] = useState(true);
  const [last_scroll_y, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (window.scrollY > last_scroll_y) {
      // if scroll down hide the navbar
      setShow(true);
    } else if (window.scrollY < last_scroll_y) {
      // if scroll up show the navbar
      setShow(false);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    // cleanup function
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [last_scroll_y]);

  return (
    <AppBar
      style={show ? styles.hidden : styles.active}
      sx={{
        boxShadow: "none",
        height: 64,
        transition: theme.transitions.create(["height"], {
          duration: theme.transitions.duration.shorter,
        }),

        background: alpha(theme.palette.dark.light, 1),
        ...(is_non_mobile && {
          width: "100%",
        }),
      }}
    >
      <Stack
        direction="row"
        height="100%"
        width="100%"
        alignItems={"center"}
        display={"flex"}
        flexDirection={"row"}
        spacing={8}
      >
        <Typography
          style={{ cursor: "pointer" }}
          fontSize={30}
          onClick={() => navigate("home")}
        >
          WeNovel
        </Typography>
        <CategoryButton />
        <SearchButton />
        <Typography
          style={{ cursor: "pointer" }}
          fontSize={15}
          onClick={() => navigate("settings")}
          color="white"
        >
          Settings
        </Typography>
        <Typography
          style={{ cursor: "pointer" }}
          fontSize={15}
          onClick={() => navigate("history")}
          color="white"
        >
          Lịch sử
        </Typography>
      </Stack>
    </AppBar>
  );
}
export default Header;
