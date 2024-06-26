import {
  AppBar,
  Typography,
  Box,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Drawer,
} from "@mui/material";
import React, { useState } from "react";
import ElevationScroll from "./ElevationScroll";
import MenuIcon from "@mui/icons-material/Menu";
import useStyles from "../utils/muiStyles";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../utils/functions";
import { useAuthStatus } from "../hooks/useAuthStatus";

import { logOut } from "../redux/user";
import { getAuth, signOut } from "firebase/auth";
const Nav = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [mobileMenu, setMobileMenu] = useState(false);

  const { loggedIn } = useAuthStatus();

  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setMobileMenu(open);
  };

  const sign_Out = async () => {
    const auth = getAuth();

    try {
      await signOut(auth);
      dispatch(logOut());
      showToast("success", "Goodbye!👋");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  const list = (anchor) => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {loggedIn ? (
          <ListItem onClick={async () => await sign_Out()}>
            <ListItemText primary="Sign Out" />
          </ListItem>
        ) : (
          <Link to="/login">
            <ListItem>
              <ListItemText primary="Log in" />
            </ListItem>
          </Link>
        )}
      </List>
    </Box>
  );

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ marginBottom: "70px" }}>
      <ElevationScroll {...props}>
        <AppBar>
          <Toolbar className={classes.toolBar}>
            <Link to="/dashboard">
              {matches ? (
                <Typography variant="h6" className={classes.logo}>
                  Invoicer
                </Typography>
              ) : (
                <Typography variant="h5" className={classes.logo}>
                  Invoicer
                </Typography>
              )}
            </Link>

            {matches ? (
              <Box>
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                >
                  <MenuIcon className={classes.menuIcon} fontSize="large" />
                </IconButton>

                <Drawer
                  anchor="right"
                  open={mobileMenu}
                  onClose={toggleDrawer(false)}
                >
                  {list("right")}
                </Drawer>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexGrow: "0.05",
                }}
              >
                {loggedIn ? (
                  <Typography
                    className={classes.link}
                    onClick={() => sign_Out()}
                  >
                    Sign Out
                  </Typography>
                ) : (
                  <Link to="/login">
                    <Typography className={classes.link}>Log in</Typography>
                  </Link>
                )}
              </Box>
            )}
          </Toolbar>
        </AppBar>
      </ElevationScroll>
    </Box>
  );
};

export default Nav;
