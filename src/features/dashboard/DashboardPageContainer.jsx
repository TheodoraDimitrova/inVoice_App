import React from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import { useInvoiceCreationReady } from "../../contexts/InvoiceCreationReadyContext";
import DashboardPageView from "./components/DashboardPageView";
import { useDashboard } from "./hooks/useDashboard";

const DashboardPageContainer = () => {
  const navigate = useNavigate();
  const { loading: invoiceGateLoading, ready: canCreateInvoice } =
    useInvoiceCreationReady();
  const dashboard = useDashboard();

  if (dashboard.status === "loading" && dashboard.source !== "cache") {
    return <Loading />;
  }

  return (
    <DashboardPageView
      businessName={dashboard.business?.name || ""}
      companyEmail={dashboard.business?.email || ""}
      canCreateInvoice={canCreateInvoice}
      invoiceGateLoading={invoiceGateLoading}
      onOpenProfile={() => navigate("/profile")}
      onOpenInvoices={() => navigate("/invoices")}
      recentInvoices={dashboard.recentInvoices}
      vatRate={dashboard.business?.vatRate ?? 20}
      metrics={dashboard.metrics}
      revenueLabel={dashboard.revenueLabel}
      averageInvoiceLabel={dashboard.averageInvoiceLabel}
    />
  );
};

export default DashboardPageContainer;
