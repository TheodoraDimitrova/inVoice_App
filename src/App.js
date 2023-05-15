import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./components/Loading";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

import { ViewInvoice } from "./pages/ViewInvoice";
import PageNotFound from "./pages/PageNotFound";

const Auth = lazy(() => import("./pages/Auth"));
const CreateInvoice = lazy(() => import("./pages/CreateInvoice"));
const Products = lazy(() => import("./pages/Products"));
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const SetupProfile = lazy(() => import("./pages/SetupProfile"));

const theme = createTheme({
  typography: {
    fontFamily: ["Sora", "sans-serif"].join(","),
  },
});

function App() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<PublicRoute />}>
              <Route path="/" element={<Home />} />
            </Route>
            <Route path="/login" element={<PublicRoute />}>
              <Route path="/login" element={<Auth />} />
            </Route>

            <Route path="/dashboard" element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route path="/new/invoice" element={<PrivateRoute />}>
              <Route path="/new/invoice" element={<CreateInvoice />} />
            </Route>
            <Route path="/new/invoice/:invoiceId" element={<PrivateRoute />}>
              <Route
                path="/new/invoice/:invoiceId"
                element={<CreateInvoice />}
              />
            </Route>
            <Route path="/products" element={<PrivateRoute />}>
              <Route path="/products" element={<Products />} />
            </Route>
            <Route path="/view/invoice/:id" element={<PrivateRoute />}>
              <Route path="/view/invoice/:id" element={<ViewInvoice />} />
            </Route>
            <Route path="/profile" element={<PrivateRoute />}>
              <Route path="/profile" element={<SetupProfile />} />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
        <ToastContainer />
      </ThemeProvider>
    </div>
  );
}

export default App;
