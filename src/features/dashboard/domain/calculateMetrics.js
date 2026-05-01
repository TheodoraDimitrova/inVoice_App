import { calculateMonthlyRevenue } from "./calculateRevenue";

export function calculateDashboardMetrics(invoices, vatRate) {
  return calculateMonthlyRevenue(invoices, vatRate);
}
