import { Sale } from "./types";

export interface SalesGroup {
  date: string;
  sales: Sale[];
}

export function groupSalesByDate(sales: Sale[]): SalesGroup[] {
  const groups = new Map<string, Sale[]>();

  for (const sale of sales) {
    const date = new Date(sale.date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    if (!groups.has(date)) {
      groups.set(date, []);
    }

    groups.get(date)!.push(sale);
  }

  return Array.from(groups.entries()).map(([date, sales]) => ({
    date,
    sales,
  }));
}