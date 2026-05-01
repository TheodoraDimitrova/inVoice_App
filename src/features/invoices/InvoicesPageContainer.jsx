import React from "react";
import Loading from "../../components/Loading";
import InvoicesPageView from "./components/InvoicesPageView";
import { useInvoicesData } from "./hooks/useInvoicesData";

const InvoicesPageContainer = () => {
  const { invoices, loading, vatRate } = useInvoicesData();

  if (loading) return <Loading />;

  return <InvoicesPageView invoices={invoices} vatRate={vatRate} />;
};

export default InvoicesPageContainer;
