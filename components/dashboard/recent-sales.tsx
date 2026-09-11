"use client";

import { Fragment, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    CreditCard,
    Trash2,
    Wallet,
} from "lucide-react";

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
            console.error(
                "Delete sale error:",
                error
            );

            toast.error("Failed to delete sale");
        } finally {
            setDeleting(false);
        }
    }

    if (groups.length === 0) {
        return (
            <div className="
                mt-8
                rounded-2xl
                border
                border-dashed
                bg-white
                p-12
                text-center
            ">
                <div className="
                    mx-auto
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    bg-amber-50
                    text-amber-600
                ">
                    <Wallet className="h-6 w-6" />
                </div>

                <p className="
                    mt-4
                    font-medium
                ">
                    अजून कोणतीही विक्री झालेली नाही.
                </p>

                <p className="
                    mt-1
                    text-sm
                    text-muted-foreground
                ">
                    नवीन विक्री केल्यावर ती येथे दिसेल.
                </p>
            </div>
        );
    }

    return (
        <div className="
            mt-8
            overflow-hidden
            rounded-2xl
            border
            bg-white
            shadow-sm
        ">

            {/* Section Header */}

            <div className="
                flex
                flex-col
                gap-4
                border-b
                bg-gradient-to-r
                from-amber-50/70
                to-white
                p-6
                sm:flex-row
                sm:items-center
                sm:justify-between
            ">

                <div className="flex items-start gap-3">

                    <div className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-amber-100
                        text-amber-700
                    ">
                        <CreditCard className="h-5 w-5" />
                    </div>

                    <div>
                        <h2 className="
                            text-xl
                            font-bold
                            tracking-tight
                        ">
                            अलीकडील विक्री
                        </h2>

                        <p className="
                            mt-1
                            text-sm
                            text-muted-foreground
                        ">
                            फ्रँचायझी ऑर्डर आणि पेमेंट माहिती
                        </p>
                    </div>

                </div>

                <div className="
                    hidden
                    rounded-full
                    border
                    bg-white
                    px-3
                    py-1.5
                    text-xs
                    font-medium
                    text-muted-foreground
                    sm:block
                ">
                    Recent Orders
                </div>

            </div>


            {/* Table */}

            <div className="overflow-x-auto">

                <table className="w-full min-w-[900px]">

                    {/* Table Header */}

                    <thead>
                        <tr className="
                            border-b
                            bg-muted/30
                            text-xs
                            uppercase
                            tracking-wide
                            text-muted-foreground
                        ">

                            <th className="
                                px-6
                                py-4
                                text-left
                                font-semibold
                            ">
                                ग्राहक
                            </th>

                            <th className="
                                px-4
                                py-4
                                text-right
                                font-semibold
                            ">
                                पाऊच
                            </th>

                            <th className="
                                px-4
                                py-4
                                text-right
                                font-semibold
                            ">
                                एकूण रक्कम
                            </th>

                            <th className="
                                px-4
                                py-4
                                text-left
                                font-semibold
                            ">
                                पेमेंट
                            </th>

                            <th className="
                                px-6
                                py-4
                                text-right
                                font-semibold
                            ">
                                Action
                            </th>

                        </tr>
                    </thead>


                    <tbody>

                        {groups.map((group) => (
                            <Fragment key={group.date}>

                                {/* Date Group */}

                                <tr>
                                    <td
                                        colSpan={5}
                                        className="
                                            border-b
                                            bg-[#f8f7f4]
                                            px-6
                                            py-3
                                        "
                                    >
                                        <div className="
                                            flex
                                            items-center
                                            gap-2
                                        ">

                                            <div className="
                                                flex
                                                h-7
                                                w-7
                                                items-center
                                                justify-center
                                                rounded-lg
                                                bg-amber-100
                                                text-amber-700
                                            ">
                                                <CalendarDays className="h-4 w-4" />
                                            </div>

                                            <span className="
                                                text-sm
                                                font-semibold
                                            ">
                                                {formatDate(group.date)}
                                            </span>

                                            <span className="
                                                rounded-full
                                                bg-white
                                                px-2
                                                py-0.5
                                                text-xs
                                                font-medium
                                                text-muted-foreground
                                            ">
                                                {group.sales.length} ऑर्डर
                                            </span>

                                        </div>
                                    </td>
                                </tr>


                                {/* Sales */}

                                {group.sales.map((sale) => (

                                    <tr
                                        key={sale.id}
                                        className="
                                            group
                                            border-b
                                            last:border-b-0
                                            transition-colors
                                            hover:bg-amber-50/30
                                        "
                                    >

                                        {/* Customer */}

                                        <td className="px-6 py-5">

                                            <div className="
                                                flex
                                                items-center
                                                gap-3
                                            ">

                                                <div className="
                                                    flex
                                                    h-10
                                                    w-10
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    bg-muted
                                                    text-sm
                                                    font-bold
                                                ">
                                                    {sale.customer
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <div>
                                                    <div className="
                                                        font-semibold
                                                    ">
                                                        {sale.customer}
                                                    </div>

                                                    <div className="
                                                        mt-0.5
                                                        text-xs
                                                        text-muted-foreground
                                                    ">
                                                        {sale.phone}
                                                    </div>
                                                </div>

                                            </div>

                                        </td>


                                        {/* Quantity */}

                                        <td className="
                                            px-4
                                            py-5
                                            text-right
                                        ">
                                            <span className="
                                                inline-flex
                                                min-w-10
                                                items-center
                                                justify-center
                                                rounded-lg
                                                bg-muted/60
                                                px-2.5
                                                py-1.5
                                                text-sm
                                                font-semibold
                                            ">
                                                {sale.quantity}
                                            </span>
                                        </td>


                                        {/* Amount */}

                                        <td className="
                                            px-4
                                            py-5
                                            text-right
                                        ">

                                            <div className="
                                                font-bold
                                            ">
                                                {formatCurrency(
                                                    sale.total
                                                )}
                                            </div>

                                            <div className="
                                                mt-1
                                                text-xs
                                                text-muted-foreground
                                            ">
                                                जमा{" "}
                                                {formatCurrency(
                                                    sale.amountPaid
                                                )}
                                            </div>

                                        </td>


                                        {/* Payment */}

                                        <td className="px-4 py-5">

                                            <div className="
                                                min-w-[220px]
                                                space-y-2
                                            ">

                                                {/* Status */}

                                                {sale.paymentStatus === "Paid" ? (
                                                    <Badge
                                                        className="
                                                            gap-1.5
                                                            border-green-200
                                                            bg-green-50
                                                            text-green-700
                                                            hover:bg-green-50
                                                        "
                                                    >
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        Paid
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        className="
                                                            gap-1.5
                                                            border-red-200
                                                            bg-red-50
                                                            text-red-700
                                                            hover:bg-red-50
                                                        "
                                                    >
                                                        <Clock3 className="h-3.5 w-3.5" />
                                                        Credit
                                                    </Badge>
                                                )}


                                                {/* Payment Details */}

                                                <div className="
                                                    flex
                                                    flex-wrap
                                                    gap-x-4
                                                    gap-y-1
                                                    text-xs
                                                ">

                                                    <span className="
                                                        text-muted-foreground
                                                    ">
                                                        Paid:
                                                        <span className="
                                                            ml-1
                                                            font-semibold
                                                            text-foreground
                                                        ">
                                                            {formatCurrency(
                                                                sale.amountPaid
                                                            )}
                                                        </span>
                                                    </span>

                                                    {sale.amountRemaining > 0 && (
                                                        <span className="
                                                            text-red-600
                                                        ">
                                                            Pending:
                                                            <span className="
                                                                ml-1
                                                                font-semibold
                                                            ">
                                                                {formatCurrency(
                                                                    sale.amountRemaining
                                                                )}
                                                            </span>
                                                        </span>
                                                    )}

                                                </div>


                                                {/* Actions */}

                                                {sale.amountRemaining > 0 && (
                                                    <div className="
                                                        flex
                                                        flex-wrap
                                                        gap-2
                                                        pt-1
                                                    ">

                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="
                                                                h-8
                                                                border-amber-200
                                                                bg-amber-50
                                                                text-amber-800
                                                                hover:bg-amber-100
                                                                hover:text-amber-900
                                                            "
                                                            onClick={() => {
                                                                setSelectedSale(
                                                                    sale
                                                                );
                                                                setPaymentDialogOpen(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            <Wallet className="mr-1.5 h-3.5 w-3.5" />
                                                            Add Payment
                                                        </Button>

                                                        <SendReminderButton
                                                            customer={
                                                                sale.customer
                                                            }
                                                            phone={
                                                                sale.phone
                                                            }
                                                            amount={
                                                                sale.amountRemaining
                                                            }
                                                        />

                                                    </div>
                                                )}

                                            </div>

                                        </td>


                                        {/* Delete */}

                                        <td className="
                                            px-6
                                            py-5
                                            text-right
                                        ">

                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="
                                                    text-muted-foreground
                                                    opacity-70
                                                    hover:bg-red-50
                                                    hover:text-red-600
                                                    group-hover:opacity-100
                                                "
                                                onClick={() => {
                                                    setSaleToDelete(
                                                        sale
                                                    );
                                                    setDeleteDialogOpen(
                                                        true
                                                    );
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="ml-1.5">
                                                    Delete
                                                </span>
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
                            className="
                                bg-destructive
                                text-destructive-foreground
                                hover:bg-destructive/90
                            "
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