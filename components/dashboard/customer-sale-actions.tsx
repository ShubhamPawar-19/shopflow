"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";

import { Sale } from "@/lib/google/types";
import { Button } from "@/components/ui/button";
import { DeleteSaleButton } from "@/components/dashboard/delete-sale-button";
import { AddPaymentDialog } from "../payments/AddPaymentDialog";

interface CustomerSaleActionsProps {
    sale: Sale;
}

export function CustomerSaleActions({
    sale,
}: CustomerSaleActionsProps) {
    const [paymentDialogOpen, setPaymentDialogOpen] =
        useState(false);

    return (
        <>
            <div className="flex flex-wrap items-center justify-end gap-2">

                {sale.amountRemaining > 0 && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                            setPaymentDialogOpen(true)
                        }
                        className="
                            h-9
                            rounded-lg
                            border-amber-200
                            bg-amber-50
                            font-medium
                            text-amber-800
                            hover:bg-amber-100
                            hover:text-amber-900
                        "
                    >
                        <CreditCard className="mr-1.5 h-4 w-4" />
                        Add Payment
                    </Button>
                )}

                <DeleteSaleButton
                    saleId={sale.id}
                    customer={sale.customer}
                />

            </div>

            <AddPaymentDialog
                sale={sale}
                open={paymentDialogOpen}
                onOpenChange={setPaymentDialogOpen}
            />
        </>
    );
}