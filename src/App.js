import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./components/Loading";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import AppShell from "./components/AppShell";

import { ViewInvoice } from "./pages/ViewInvoice";
import PageNotFound from "./pages/PageNotFound";
import { theme } from "./theme";

const Auth = lazy(() => import("./pages/Auth"));
const CreateInvoice = lazy(() => import("./pages/CreateInvoice"));
const Products = lazy(() => import("./pages/Products"));
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Invoices = lazy(() => import("./pages/Invoices"));
const SetupProfile = lazy(() => import("./pages/SetupProfile"));
const Customers = lazy(() => import("./pages/Customers"));

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

            <Route element={<PrivateRoute />}>
              <Route element={<AppShell />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/products" element={<Products />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/invoices/new" element={<CreateInvoice />} />
                <Route path="/new/invoice/:invoiceId" element={<CreateInvoice />} />
                <Route path="/invoices/preview" element={<ViewInvoice />} />
                <Route path="/invoices/:id" element={<ViewInvoice />} />
                <Route path="/profile" element={<SetupProfile />} />
              </Route>
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
