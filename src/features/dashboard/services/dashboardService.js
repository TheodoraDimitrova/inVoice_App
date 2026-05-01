import { getCountryCommercialDefaults } from "../../../data/countryCommercialRules";
import {
  readDashboardCache,
  writeDashboardCache,
} from "../cache/dashboardCache";
import { calculateDashboardMetrics } from "../domain/calculateMetrics";
import { subscribeBusiness } from "./businessService";
import { subscribeInvoices } from "./invoicesService";

function normalizeBusiness(business) {
  if (!business) {
    return {
      name: "",
      email: "",
      currency: "EUR",
      vatRate: 20,
    };
  }

  const country = typeof business.country === "string" ? business.country : "";
  const fallbackCurrency = getCountryCommercialDefaults(country).currency;
  const parsedVatRate = Number(business.vatRate);

  return {
    name:
      typeof business.businessName === "string"
        ? business.businessName.trim()
        : "",
    email: typeof business.email === "string" ? business.email.trim() : "",
    currency:
      typeof business.currency === "string" && business.currency.trim()
        ? business.currency.trim()
        : fallbackCurrency,
    vatRate: Number.isFinite(parsedVatRate) ? parsedVatRate : 20,
  };
}

function formatMoney(currency, amount) {
  return `${currency} ${Number(amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function buildDashboardViewModel(snapshot) {
  const business = normalizeBusiness(snapshot.business);
  const metrics = calculateDashboardMetrics(
    snapshot.invoices,
    business.vatRate,
  );
  const currency = business.currency || "EUR";

  return {
    ...snapshot,
    business,
    metrics,
    recentInvoices: snapshot.invoices.slice(0, 7),
    revenueLabel: formatMoney(currency, metrics.monthlyRevenue),
    averageInvoiceLabel: formatMoney(currency, metrics.averageInvoiceValue),
  };
}

export function subscribeDashboard(uid, onData) {
  const cached = readDashboardCache(uid);
  if (cached) {
    onData({
      ...cached,
      status: "ready",
      source: "cache",
    });
  }

  let dashboardState = {
    uid,
    invoices: cached?.invoices || [],
    business: cached?.business || null,
    source: "realtime",
    status: cached ? "ready" : "loading",
    streams: {
      invoices: cached ? "ready" : "loading",
      business: cached ? "ready" : "loading",
    },
  };

  const emit = () => {
    const hasError =
      dashboardState.streams.invoices === "error" ||
      dashboardState.streams.business === "error";
    const allReady =
      dashboardState.streams.invoices === "ready" &&
      dashboardState.streams.business === "ready";

    const status = allReady ? "ready" : hasError ? "degraded" : "loading";
    const nextSnapshot = {
      ...dashboardState,
      status,
      source: "realtime",
    };

    dashboardState = nextSnapshot;
    writeDashboardCache(uid, nextSnapshot);
    onData(nextSnapshot);
  };

  const unsubscribeInvoices = subscribeInvoices(
    uid,
    (invoices) => {
      dashboardState = {
        ...dashboardState,
        invoices,
        streams: {
          ...dashboardState.streams,
          invoices: "ready",
        },
      };
      emit();
    },
    () => {
      dashboardState = {
        ...dashboardState,
        streams: {
          ...dashboardState.streams,
          invoices: "error",
        },
      };
      emit();
    },
  );

  const unsubscribeBusiness = subscribeBusiness(
    uid,
    (business) => {
      dashboardState = {
        ...dashboardState,
        business,
        streams: {
          ...dashboardState.streams,
          business: "ready",
        },
      };
      emit();
    },
    () => {
      dashboardState = {
        ...dashboardState,
        streams: {
          ...dashboardState.streams,
          business: "error",
        },
      };
      emit();
    },
  );

  emit();

  return () => {
    unsubscribeInvoices?.();
    unsubscribeBusiness?.();
  };
}
