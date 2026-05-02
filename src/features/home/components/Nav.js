import { Button } from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import React from "react";
import { Link } from "react-router-dom";

const Nav = ({ loggedIn, onSignOut, ...props }) => {
  void props;

  return (
    <div className="mb-[56px] sm:mb-[64px]">
      <header className="fixed inset-x-0 top-0 z-50 bg-white text-[var(--color-brand-charcoal)] shadow-sm">
        <div className="flex min-h-[56px] w-full items-center justify-center bg-white sm:min-h-[64px]">
            <div className="page-shell flex min-h-[56px] items-center justify-between sm:min-h-[64px]">
              <Link
                to={loggedIn ? "/dashboard" : "/"}
                className="inline-flex items-center leading-none no-underline"
              >
                <span className="m-0 cursor-pointer text-xl leading-tight text-[var(--color-brand-charcoal)] sm:text-2xl">
                  Invoicer
                </span>
              </Link>

              <div className="flex shrink-0 items-center">
                {loggedIn ? (
                  <Button
                    type="button"
                    variant="text"
                    color="inherit"
                    onClick={onSignOut}
                    startIcon={<LogoutOutlinedIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />}
                    sx={{
                      textTransform: "none",
                      fontSize: { xs: "0.95rem", sm: "1rem" },
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
                    <span className="cursor-pointer text-[0.95rem] text-[var(--color-brand-charcoal)] transition-colors hover:text-[var(--color-brand-primary)] sm:text-base">
                      Вход
                    </span>
                  </Link>
                )}
              </div>
            </div>
        </div>
      </header>
    </div>
  );
};

export default Nav;
