import { AppBar, Typography, Box, Toolbar, Button } from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import React from "react";
import ElevationScroll from "../../../components/ElevationScroll";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "react-router-dom";

const Nav = ({ loggedIn, onSignOut, ...props }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

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
                <Typography
                  variant={matches ? "h6" : "h5"}
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
              </Link>

              <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                {loggedIn ? (
                  <Button
                    type="button"
                    variant="text"
                    color="inherit"
                    onClick={onSignOut}
                    startIcon={<LogoutOutlinedIcon sx={{ fontSize: matches ? 20 : 22 }} />}
                    sx={{
                      textTransform: "none",
                      fontSize: matches ? "0.95rem" : "1rem",
                      color: "var(--color-brand-charcoal)",
                      px: 1,
                      minWidth: 0,
                      "&:hover": {
                        color: "var(--color-brand-primary)",
                        bgcolor: "rgba(15, 118, 110, 0.06)",
                      },
                    }}
                  >
                    Изход
                  </Button>
                ) : (
                  <Link to="/login">
                    <Typography
                      sx={{
                        fontSize: matches ? "0.95rem" : "1rem",
                        color: "var(--color-brand-charcoal)",
                        cursor: "pointer",
                        transition: "color 0.2s ease",
                        "&:hover": { color: "var(--color-brand-primary)" },
                      }}
                    >
                      Вход
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
