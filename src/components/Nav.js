import { AppBar, Typography, Box, Toolbar } from "@mui/material";
import React from "react";
import ElevationScroll from "./ElevationScroll";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../utils/functions";
import { useAuthStatus } from "../hooks/useAuthStatus";

import { logOut } from "../redux/user";
import { getAuth, signOut } from "firebase/auth";
const Nav = (props) => {
  const dispatch = useDispatch();
  const { loggedIn } = useAuthStatus();
  const navigate = useNavigate();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

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

  return (
    <Box sx={{ marginBottom: { xs: "56px", sm: "64px" } }}>
      <ElevationScroll {...props}>
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: "#ffffff",
            color: "var(--color-brand-charcoal)",
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: "56px", sm: "64px" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 0,
              width: "100%",
              backgroundColor: "#ffffff",
            }}
          >
            <Box className="page-shell flex items-center justify-between min-h-[56px] sm:min-h-[64px]">
              <Link
                to={loggedIn ? "/dashboard" : "/"}
                className="inline-flex items-center leading-none no-underline"
              >
                {matches ? (
                  <Typography
                    variant="h6"
                    component="span"
                    sx={{
                      margin: 0,
                      lineHeight: 1.15,
                      color: "var(--color-brand-charcoal)",
                      cursor: "pointer",
                    }}
                  >
                    Invoicer
                  </Typography>
                ) : (
                  <Typography
                    variant="h5"
                    component="span"
                    sx={{
                      margin: 0,
                      lineHeight: 1.15,
                      color: "var(--color-brand-charcoal)",
                      cursor: "pointer",
                    }}
                  >
                    Invoicer
                  </Typography>
                )}
              </Link>

              <Box
                sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}
              >
                {loggedIn ? (
                  <Typography
                    onClick={() => sign_Out()}
                    sx={{
                      fontSize: matches ? "0.95rem" : "1rem",
                      color: "var(--color-brand-charcoal)",
                      cursor: "pointer",
                      transition: "color 0.2s ease",
                      "&:hover": {
                        color: "var(--color-brand-primary)",
                      },
                    }}
                  >
                    Sign Out
                  </Typography>
                ) : (
                  <Link to="/login">
                    <Typography
                      sx={{
                        fontSize: matches ? "0.95rem" : "1rem",
                        color: "var(--color-brand-charcoal)",
                        cursor: "pointer",
                        transition: "color 0.2s ease",
                        "&:hover": {
                          color: "var(--color-brand-primary)",
                        },
                      }}
                    >
                      Log in
                    </Typography>
                  </Link>
                )}
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
    </Box>
  );
};

export default Nav;
