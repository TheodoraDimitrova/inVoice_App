import { calculateMonthlyRevenue } from "./calculateRevenue";

export function calculateDashboardMetrics(invoices, vatRate, isVatRegistered) {
  return calculateMonthlyRevenue(invoices, vatRate, isVatRegistered);
}
