import { getSales } from "@/lib/google/sales";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { SendReminderButton } from "@/components/dashboard/send-reminder-button";
import { getPaymentsByCustomerPhone } from "@/lib/google/payments";

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

    const customerPayments = (
        await getPaymentsByCustomerPhone(phone)
    ).sort(
        (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
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

    const totalPaid = customerSales.reduce(
        (sum, sale) => sum + sale.amountPaid,
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

                <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">
                            Total Purchases
                        </p>
                        <p className="text-2xl font-bold">
                            {formatCurrency(totalPurchases)}
                        </p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">
                            Total Paid
                        </p>

                        <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(totalPaid)}
                        </p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">
                            Outstanding
                        </p>

                        <p className="text-2xl font-bold text-red-600">
                            {formatCurrency(outstanding)}
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
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant={
                                        sale.paymentStatus === "Paid"
                                            ? "default"
                                            : "destructive"
                                    }
                                >
                                    {sale.paymentStatus}
                                </Badge>

                                {sale.amountRemaining > 0 && (
                                    <SendReminderButton
                                        customer={sale.customer}
                                        phone={sale.phone}
                                        amount={sale.amountRemaining}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="rounded-lg border p-6 space-y-4">
                <h2 className="text-xl font-bold">
                    Payment History
                </h2>

                {customerPayments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No payments found.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {customerPayments.map((payment) => (
                            <div
                                key={payment.id}
                                className="flex items-center justify-between border-b pb-3 last:border-b-0"
                            >
                                <div>
                                    <p className="font-medium">
                                        {payment.paymentMode}
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(payment.date)}
                                    </p>
                                </div>

                                <p className="font-semibold">
                                    {formatCurrency(payment.amount)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}