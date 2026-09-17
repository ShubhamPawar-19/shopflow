"use client";

import { useState } from "react";
import {
    CreditCard,
    Pencil,
} from "lucide-react";

import { Sale } from "@/lib/google/types";
import { Button } from "@/components/ui/button";

import { DeleteSaleButton } from "@/components/dashboard/delete-sale-button";
import { AddPaymentDialog } from "../payments/AddPaymentDialog";
import { EditSaleDialog } from "../payments/EditSaleDialog";

interface CustomerSaleActionsProps {
    sale: Sale;
}

export function CustomerSaleActions({
    sale,
}: CustomerSaleActionsProps) {
    const [editDialogOpen, setEditDialogOpen] =
        useState(false);

    const [paymentDialogOpen, setPaymentDialogOpen] =
        useState(false);

    return (
        <>
            <div className="flex flex-wrap items-center justify-end gap-2">

                {/* Edit Sale */}
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                        setEditDialogOpen(true)
                    }
                    className="
                        h-9
                        rounded-lg
                        border-border
                        bg-white
                        font-medium
                        text-muted-foreground
                        hover:border-amber-200
                        hover:bg-amber-50
                        hover:text-amber-800
                    "
                >
                    <Pencil className="mr-1.5 h-4 w-4" />
                    Edit
                </Button>

                {/* Add Payment */}
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

                {/* Delete */}
                <DeleteSaleButton
                    saleId={sale.id}
                    customer={sale.customer}
                />

            </div>

            {/* Edit Dialog */}
            <EditSaleDialog
                sale={sale}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
            />

            {/* Payment Dialog */}
            <AddPaymentDialog
                sale={sale}
                open={paymentDialogOpen}
                onOpenChange={setPaymentDialogOpen}
            />
        </>
    );
}