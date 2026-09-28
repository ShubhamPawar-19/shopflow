"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CustomerPaymentDialog } from "./customer-payment-dialog";

interface CustomerPaymentButtonProps {
    customer: string;
    phone: string;
    outstanding: number;
}

export function CustomerPaymentButton({
    customer,
    phone,
    outstanding,
}: CustomerPaymentButtonProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                className="
                    rounded-xl
                    bg-amber-600
                    font-semibold
                    text-white
                    shadow-sm
                    hover:bg-amber-700
                "
            >
                <Wallet className="h-4 w-4" />
                Add Payment
            </Button>

            <CustomerPaymentDialog
                customer={customer}
                phone={phone}
                outstanding={outstanding}
                open={open}
                onOpenChange={setOpen}
            />
        </>
    );
}