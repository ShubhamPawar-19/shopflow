"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Fragment } from "react";
import { SalesGroup } from "@/lib/google/utils";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";

interface RecentSalesProps {
    groups: SalesGroup[];
}

export function RecentSales({ groups }: RecentSalesProps) {
    const router = useRouter();

    if (groups.length === 0) {
        return (
            <div className="rounded-lg border p-12 text-center text-muted-foreground">
                No sales found.
            </div>
        );
    }

    async function markAsPaid(saleId: string) {
        try {
            const response = await fetch(`/api/sales/${saleId}/payment`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    paymentStatus: "Paid",
                }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Payment updated");

                router.refresh();
            } else {
                toast.error("Failed to update payment");
            }
        } catch (error) {
            console.error(error);

            toast.error("Something went wrong");
        }
    }

    return (
        <div className="rounded-lg border mt-8">
            <div className="border-b p-4">
                <h2 className="font-semibold text-lg">
                    Recent Sales
                </h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b text-left">
                            <th className="p-4">Customer</th>
                            <th className="p-4">Jaggery</th>
                            <th className="p-4">Tea</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Payment</th>
                        </tr>
                    </thead>

                    <tbody>
                        {groups.map((group) => (
                            <Fragment key={group.date}>
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="bg-muted p-4 font-semibold"
                                    >
                                        <td
                                            colSpan={5}
                                            className="bg-muted p-4 font-semibold"
                                        >
                                            📅 {group.date} ({group.sales.length} sale{group.sales.length > 1 ? "s" : ""})
                                        </td>
                                    </td>
                                </tr>

                                {group.sales.map((sale) => (
                                    <tr key={sale.id} className="border-b hover:bg-muted/50 transition-colors">
                                        <td className="p-4 text-right">{sale.customer}</td>
                                        <td className="p-4 text-right">{sale.jaggeryKg} kg</td>
                                        <td className="p-4 text-right">{sale.teaKg} kg</td>
                                        <td className="p-4 text-right font-medium">
                                            {new Intl.NumberFormat("en-IN", {
                                                style: "currency",
                                                currency: "INR",
                                                maximumFractionDigits: 0,
                                            }).format(sale.total)}
                                        </td>
                                        <td className="p-4 font-medium">
                                            {sale.paymentStatus === "Paid" ? (
                                                <Badge>Paid</Badge>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="destructive">
                                                        Credit
                                                    </Badge>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="link" size="sm">
                                                                Mark Paid
                                                            </Button>
                                                        </AlertDialogTrigger>

                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Mark payment as received?
                                                                </AlertDialogTitle>

                                                                <AlertDialogDescription>
                                                                    Customer: <strong>{sale.customer}</strong>

                                                                    <br />

                                                                    Amount: <strong>₹{sale.total}</strong>

                                                                    <br /><br />

                                                                    This will update the payment status to <strong>Paid</strong>.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>

                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Cancel
                                                                </AlertDialogCancel>

                                                                <AlertDialogAction
                                                                    onClick={() => markAsPaid(sale.id)}
                                                                >
                                                                    Yes, Mark Paid
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}