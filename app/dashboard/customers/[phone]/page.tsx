import { getSales } from "@/lib/google/sales";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils/format";

interface Props {
    params: Promise<{
        phone: string;
    }>;
}

export default async function CustomerPage({
    params,
}: Props) {
    const { phone } = await params;

    const sales = await getSales();

    const customerSales = sales.filter(
        (sale) => sale.phone === phone
    );

    const customer = customerSales[0];

    const totalPurchases = customerSales.reduce(
        (sum, sale) => sum + sale.total,
        0
    );

    const outstanding = customerSales.reduce(
        (sum, sale) => sum + sale.amountRemaining,
        0
    );

    return (
        <main className="space-y-6">
            <h1 className="text-3xl font-bold">
                Customer Ledger
            </h1>



            <div className="rounded-lg border p-6 space-y-4">
                <div>
                    <h2 className="text-2xl font-bold">
                        {customer.customer}
                    </h2>

                    <p className="text-muted-foreground">
                        {customer.phone}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">
                            Total Purchases
                        </p>

                        <p className="text-2xl font-bold">
                            ₹{totalPurchases}
                        </p>
                    </div>

                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">
                            Outstanding
                        </p>

                        <p className="text-2xl font-bold text-red-600">
                            ₹{outstanding}
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-lg border">
                {customerSales.map((sale) => (
                    <div
                        key={sale.id}
                        className="border-b p-4 last:border-b-0"
                    >
                        <div className="flex justify-between">
                            <p className="font-medium">
                                {formatDate(sale.date)}
                            </p>

                            <p className="font-semibold">
                                {formatCurrency(sale.total)}
                            </p>
                        </div>

                        <div className="mt-2 text-sm text-muted-foreground">
                            {sale.jaggeryKg > 0 && (
                                <div>🟤 Jaggery: {sale.jaggeryKg} kg</div>
                            )}

                            {sale.teaKg > 0 && (
                                <div>🍵 Tea Powder: {sale.teaKg} kg</div>
                            )}
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                            <div>
                                <p className="text-sm">
                                    Paid: {formatCurrency(sale.amountPaid)}
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    Remaining: {formatCurrency(sale.amountRemaining)}
                                </p>
                            </div>

                            <Badge
                                variant={
                                    sale.paymentStatus === "Paid"
                                        ? "default"
                                        : "destructive"
                                }
                            >
                                {sale.paymentStatus}
                            </Badge>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}