import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Divider,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AddIcon from "@mui/icons-material/Add";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { logOut } from "../redux/user";
import { showToast } from "../utils/functions";
import {
  InvoiceCreationReadyProvider,
  useInvoiceCreationReady,
} from "../contexts/InvoiceCreationReadyContext";

const DRAWER_WIDTH = 240;

const navLinkSx = {
  mx: 1,
  borderRadius: 2,
  mb: 0.25,
  color: "var(--color-brand-charcoal)",
  "&.Mui-selected": {
    bgcolor: "rgba(15, 118, 110, 0.1)",
    color: "var(--color-brand-primary)",
    fontWeight: 600,
    "& .MuiListItemIcon-root": {
      color: "var(--color-brand-primary)",
    },
  },
  "&:hover": {
    bgcolor: "rgba(15, 23, 42, 0.04)",
  },
};

const AppShellContent = () => {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const dispatch = useDispatch();
  const {
    loading: invoiceGateLoading,
    ready: canCreateInvoice,
  } = useInvoiceCreationReady();

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserEmail(user?.email ?? "");
    });
    return () => unsub();
  }, []);

  const go = (path) => {
    navigate(path);
    if (isSmDown) setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const signOutUser = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      dispatch(logOut());
      showToast("success", "Goodbye!👋");
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar
        sx={{
          minHeight: 56,
          px: 2,
          borderBottom: "1px solid var(--color-border-soft)",
        }}
      >
        <NavLink to="/dashboard" className="no-underline" style={{ color: "inherit" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "var(--color-brand-charcoal)",
              letterSpacing: "-0.02em",
            }}
          >
            Invoicer
          </Typography>
        </NavLink>
      </Toolbar>
      <List sx={{ px: 0.5, pt: 1.5, flex: 1 }}>
        <ListItemButton
          selected={pathname === "/dashboard"}
          onClick={() => go("/dashboard")}
          sx={navLinkSx}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <DashboardOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Dashboard" primaryTypographyProps={{ fontSize: "0.9375rem" }} />
        </ListItemButton>
        <ListItemButton
          selected={pathname === "/invoices"}
          onClick={() => go("/invoices")}
          sx={navLinkSx}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <ReceiptLongOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Invoices" primaryTypographyProps={{ fontSize: "0.9375rem" }} />
        </ListItemButton>
        <ListItemButton
          selected={pathname === "/products"}
          onClick={() => go("/products")}
          sx={navLinkSx}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Inventory2OutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Products" primaryTypographyProps={{ fontSize: "0.9375rem" }} />
        </ListItemButton>
        <ListItemButton
          selected={pathname === "/customers"}
          onClick={() => go("/customers")}
          sx={navLinkSx}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <PeopleOutlineOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Customers" primaryTypographyProps={{ fontSize: "0.9375rem" }} />
        </ListItemButton>
        <ListItemButton disabled sx={{ mx: 1, borderRadius: 2, opacity: 0.55 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <AssessmentOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Reports"
            secondary="Coming soon"
            primaryTypographyProps={{ fontSize: "0.9375rem" }}
            secondaryTypographyProps={{ fontSize: "0.7rem" }}
          />
        </ListItemButton>
      </List>
      <Divider sx={{ borderColor: "rgba(15, 23, 42, 0.12)" }} />
      <List sx={{ px: 0.5, py: 1 }}>
        <ListItemButton
          selected={pathname === "/profile"}
          onClick={() => go("/profile")}
          sx={navLinkSx}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <SettingsOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Profile settings" primaryTypographyProps={{ fontSize: "0.9375rem" }} />
        </ListItemButton>
      </List>
      {userEmail ? (
        <Box
          sx={{
            pt: 2,
            px: 2,
            borderTop: "1px solid var(--color-border-soft)",
            paddingBottom: (theme) =>
              `calc(${theme.spacing(4)} + env(safe-area-inset-bottom, 0px))`,
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 600 }}>
            Signed in
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              wordBreak: "break-all",
              lineHeight: 1.35,
              fontSize: "0.8125rem",
            }}
            title={userEmail}
          >
            {userEmail}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
        aria-label="main navigation"
      >
        {isSmDown ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: DRAWER_WIDTH,
                borderRight: "1px solid var(--color-border-soft)",
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: DRAWER_WIDTH,
                borderRight: "1px solid var(--color-border-soft)",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar
          sx={{
            minHeight: 56,
            px: { xs: 1.5, sm: 2 },
            borderBottom: "1px solid var(--color-border-soft)",
            bgcolor: "#ffffff",
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 1.5 },
          }}
        >
          {isSmDown && (
            <IconButton
              color="inherit"
              aria-label="open menu"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ color: "var(--color-brand-charcoal)" }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {userEmail ? (
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
              sx={{
                display: { xs: "none", sm: "block" },
                mr: { sm: 2.5, md: 3.5 },
                maxWidth: { sm: 200, md: 280 },
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: "0.8125rem",
                lineHeight: 1.25,
                alignSelf: "center",
              }}
              title={userEmail}
            >
              {userEmail}
            </Typography>
          ) : null}
          <Tooltip
            disableHoverListener={invoiceGateLoading || canCreateInvoice}
            title={'Add tax registration (VAT settings), company ID, and bank details in Profile settings, or enable "I don\'t need bank details on my invoices".'}
          >
            <span>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<AddIcon />}
                disabled={invoiceGateLoading || !canCreateInvoice}
                onClick={() => navigate("/new/invoice")}
                sx={{
                  minHeight: 40,
                  px: 1.75,
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow:
                    "0 2px 12px rgba(15, 118, 110, 0.12), 0 1px 4px rgba(15, 23, 42, 0.06)",
                }}
              >
                New invoice
              </Button>
            </span>
          </Tooltip>
          <Button
            variant="text"
            color="inherit"
            size="small"
            startIcon={<LogoutOutlinedIcon sx={{ fontSize: 20 }} />}
            onClick={signOutUser}
            sx={{
              minHeight: 40,
              textTransform: "none",
              color: "var(--color-brand-charcoal)",
              "&:hover": { color: "var(--color-brand-primary)", bgcolor: "rgba(15, 118, 110, 0.06)" },
            }}
          >
            Sign out
          </Button>
        </Toolbar>
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            backgroundImage:
              "linear-gradient(180deg, #e6faf1 0%, #f8fafc 28%, #f8fafc 100%)",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

const AppShell = () => (
  <InvoiceCreationReadyProvider>
    <AppShellContent />
  </InvoiceCreationReadyProvider>
);

export default AppShell;
