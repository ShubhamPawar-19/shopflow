"use client";

import { Fragment, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { SalesGroup } from "@/lib/google/utils";
import { Sale } from "@/lib/google/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
    formatCurrency,
    formatDate,
} from "@/lib/utils/format";

import { AddPaymentDialog } from "@/components/payments/AddPaymentDialog";
import { SendReminderButton } from "./send-reminder-button";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";


interface RecentSalesProps {
    groups: SalesGroup[];
}


export function RecentSales({
    groups,
}: RecentSalesProps) {

    const router = useRouter();

    const [selectedSale, setSelectedSale] =
        useState<Sale | null>(null);

    const [paymentDialogOpen, setPaymentDialogOpen] =
        useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] =
        useState(false);

    const [saleToDelete, setSaleToDelete] =
        useState<Sale | null>(null);

    const [deleting, setDeleting] =
        useState(false);


    async function handleDeleteSale() {
        if (!saleToDelete) return;

        setDeleting(true);

        try {
            const response = await fetch(
                `/api/sales/${saleToDelete.id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.error || "Failed to delete sale"
                );
            }

            toast.success("Sale deleted successfully");

            setDeleteDialogOpen(false);
            setSaleToDelete(null);

            router.refresh();

        } catch (error) {
            console.error("Delete sale error:", error);

            toast.error("Failed to delete sale");

        } finally {
            setDeleting(false);
        }
    }


    if (groups.length === 0) {
        return (
            <div className="
        rounded-xl
        border
        p-12
        text-center
        text-muted-foreground
      ">
                अजून कोणतीही विक्री झालेली नाही.
            </div>
        );
    }


    return (
        <div className="
      rounded-xl
      border
      mt-8
      overflow-hidden
    ">

            {/* Header */}

            <div className="
        border-b
        p-5
        flex
        items-center
        justify-between
      ">

                <div>
                    <h2 className="
            text-xl
            font-bold
          ">
                        अलीकडील विक्री
                    </h2>

                    <p className="
            text-sm
            text-muted-foreground
          ">
                        फ्रँचायझी ऑर्डर आणि पेमेंट माहिती
                    </p>
                </div>

            </div>


            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead>

                        <tr className="
              border-b
              bg-muted/30
              text-left
            ">

                            <th className="p-4">
                                ग्राहक
                            </th>

                            <th className="
                p-4
                text-right
              ">
                                पाऊच
                            </th>

                            <th className="
                p-4
                text-right
              ">
                                एकूण रक्कम
                            </th>

                            <th className="p-4">
                                पेमेंट
                            </th>

                            <th className="p-4 text-right">
                                Action
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {groups.map((group) => (
                            <Fragment key={group.date}>

                                {/* Date */}

                                <tr>

                                    <td
                                        colSpan={5}
                                        className="
                      bg-muted
                      p-4
                      font-semibold
                    "
                                    >

                                        📅 {formatDate(group.date)}

                                        <span className="
                      ml-2
                      text-sm
                      text-muted-foreground
                    ">
                                            ({group.sales.length} ऑर्डर)
                                        </span>

                                    </td>

                                </tr>


                                {group.sales.map((sale) => (

                                    <tr
                                        key={sale.id}
                                        className="
                      border-b
                      hover:bg-muted/40
                      transition
                    "
                                    >

                                        {/* Customer */}

                                        <td className="p-4">

                                            <div className="
                        font-semibold
                      ">
                                                {sale.customer}
                                            </div>

                                            <div className="
                        text-sm
                        text-muted-foreground
                      ">
                                                {sale.phone}
                                            </div>

                                        </td>


                                        {/* Quantity */}

                                        <td className="
                      p-4
                      text-right
                      font-medium
                    ">
                                            {sale.quantity}
                                        </td>


                                        {/* Amount */}

                                        <td className="
                      p-4
                      text-right
                    ">

                                            <div className="
                        font-semibold
                      ">
                                                {formatCurrency(sale.total)}
                                            </div>

                                            <div className="
                        text-xs
                        text-muted-foreground
                      ">
                                                भरले:{" "}
                                                {formatCurrency(
                                                    sale.amountPaid
                                                )}
                                            </div>

                                        </td>


                                        {/* Payment */}

                                        <td className="p-4">

                                            <div className="space-y-3">

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

                                                </div>


                                                <div className="text-sm">

                                                    <p>
                                                        Paid:
                                                        <span className="font-semibold ml-1">
                                                            {formatCurrency(
                                                                sale.amountPaid
                                                            )}
                                                        </span>
                                                    </p>

                                                    <p className="text-red-600">
                                                        Pending:
                                                        <span className="font-semibold ml-1">
                                                            {formatCurrency(
                                                                sale.amountRemaining
                                                            )}
                                                        </span>
                                                    </p>

                                                </div>


                                                {sale.amountRemaining > 0 && (

                                                    <div className="flex gap-2">

                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                setSelectedSale(sale);
                                                                setPaymentDialogOpen(true);
                                                            }}
                                                        >
                                                            Add Payment
                                                        </Button>


                                                        <SendReminderButton
                                                            customer={sale.customer}
                                                            phone={sale.phone}
                                                            amount={sale.amountRemaining}
                                                        />

                                                    </div>

                                                )}

                                            </div>

                                        </td>


                                        {/* Delete */}

                                        <td className="p-4 text-right">

                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => {
                                                    setSaleToDelete(sale);
                                                    setDeleteDialogOpen(true);
                                                }}
                                            >
                                                Delete
                                            </Button>

                                        </td>

                                    </tr>

                                ))}

                            </Fragment>
                        ))}

                    </tbody>

                </table>

            </div>


            {/* Add Payment Dialog */}

            {selectedSale && (

                <AddPaymentDialog
                    sale={selectedSale}
                    open={paymentDialogOpen}
                    onOpenChange={(open) => {

                        setPaymentDialogOpen(open);

                        if (!open) {
                            setSelectedSale(null);
                            router.refresh();
                        }

                    }}
                />

            )}


            {/* Delete Confirmation */}

            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >

                <AlertDialogContent>

                    <AlertDialogHeader>

                        <AlertDialogTitle>
                            Delete this sale?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This will permanently delete the sale
                            {saleToDelete
                                ? ` for ${saleToDelete.customer}`
                                : ""}
                            {" "}and all payments associated with it.
                            This action cannot be undone.
                        </AlertDialogDescription>

                    </AlertDialogHeader>


                    <AlertDialogFooter>

                        <AlertDialogCancel
                            disabled={deleting}
                        >
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={handleDeleteSale}
                            disabled={deleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleting
                                ? "Deleting..."
                                : "Delete Sale"}
                        </AlertDialogAction>

                    </AlertDialogFooter>

                </AlertDialogContent>

            </AlertDialog>

        </div>
    );
}
