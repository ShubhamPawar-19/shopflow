import { getSales } from "./sales";
import { CustomerSummary } from "./types";

export async function getCustomers(): Promise<CustomerSummary[]> {
    const sales = await getSales();
    const customers = new Map<string, CustomerSummary>();
    for (const sale of sales) {
        const existingCustomer = customers.get(sale.phone);
        if (!existingCustomer) {
            customers.set(sale.phone, {
                customer: sale.customer,
                phone: sale.phone,
                totalPurchases: sale.total,
                outstanding: sale.amountRemaining,
                lastPurchase: sale.date,
                salesCount: 1,
            });

            continue;
        }
        existingCustomer.totalPurchases += sale.total;

        existingCustomer.outstanding += sale.amountRemaining;

        existingCustomer.salesCount += 1;

        if (
            new Date(sale.date) >
            new Date(existingCustomer.lastPurchase)
        ) {
            existingCustomer.lastPurchase = sale.date;
        }
    }
    return Array.from(customers.values());
}