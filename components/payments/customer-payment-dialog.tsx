"use client";

import { useState } from "react";
import { IndianRupee, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { PaymentMode } from "@/lib/google/types";

interface CustomerPaymentDialogProps {
    customer: string;
    phone: string;
    outstanding: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CustomerPaymentDialog({
    customer,
    phone,
    outstanding,
    open,
    onOpenChange,
}: CustomerPaymentDialogProps) {
    const router = useRouter();

    const [amount, setAmount] = useState("");
    const [paymentMode, setPaymentMode] =
        useState<PaymentMode>("CASH");
    const [loading, setLoading] = useState(false);

    const paymentAmount = Number(amount) || 0;

    const unallocatedPreview = Math.max(
        paymentAmount - outstanding,
        0
    );

    async function handleSave() {
        if (!amount || paymentAmount <= 0) {
            toast.error(
                "Please enter a valid payment amount."
            );
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "/api/payments",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        customer,
                        phone,
                        amount: paymentAmount,
                        paymentMode,
                    }),
                }
            );

            const result = await response.json();

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.error ||
                        "Failed to save payment"
                );
            }

            const data = result.data;

            if (data.unallocatedAmount > 0) {
                toast.success(
                    `Payment saved. ₹${data.unallocatedAmount.toLocaleString(
                        "en-IN"
                    )} remains as advance.`
                );
            } else {
                toast.success(
                    "Payment added successfully."
                );
            }

            setAmount("");
            setPaymentMode("CASH");
            onOpenChange(false);

            router.refresh();
        } catch (error) {
            console.error(
                "Customer payment error:",
                error
            );

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent
                className="
                    flex
                    max-h-[90vh]
                    w-[calc(100%-2rem)]
                    max-w-md
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    p-2
                "
            >
                {/* Header */}

                <DialogHeader
                    className="
                        shrink-0
                        border-b
                        bg-linear-to-r
                        from-amber-50/80
                        to-white
                        px-5
                        py-4
                        sm:px-6
                        sm:py-5
                    "
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-amber-100
                                text-amber-700
                                sm:h-11
                                sm:w-11
                            "
                        >
                            <Wallet className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                            <DialogTitle className="text-lg font-bold sm:text-xl">
                                Add Payment
                            </DialogTitle>

                            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                                ग्राहकाचे पेमेंट नोंदवा
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                {/* Scrollable content */}

                <div
                    className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        px-5
                        py-5
                        sm:px-6
                        sm:py-6
                    "
                >
                    <div className="space-y-5">

                        {/* Customer summary */}

                        <div
                            className="
                                rounded-2xl
                                border
                                border-amber-100
                                bg-amber-50/60
                                p-4
                            "
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        ग्राहक
                                    </p>

                                    <p className="mt-1 truncate font-semibold">
                                        {customer}
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {phone}
                                    </p>
                                </div>

                                <div className="shrink-0 text-right">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        {outstanding > 0
                                            ? "बाकी"
                                            : "Advance"}
                                    </p>

                                    <p
                                        className={
                                            outstanding > 0
                                                ? "mt-1 text-lg font-bold text-red-600 sm:text-xl"
                                                : "mt-1 text-lg font-bold text-amber-600 sm:text-xl"
                                        }
                                    >
                                        ₹
                                        {outstanding.toLocaleString(
                                            "en-IN"
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Advance notice */}

                        {outstanding <= 0 && (
                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-amber-200
                                    bg-amber-50
                                    px-4
                                    py-3
                                "
                            >
                                <p className="text-sm font-medium text-amber-800">
                                    No outstanding balance
                                </p>

                                <p className="mt-1 text-xs leading-5 text-amber-700">
                                    This payment will be recorded
                                    as an advance for future sales.
                                </p>
                            </div>
                        )}

                        {/* Payment details */}

                        <div
                            className="
                                space-y-5
                                rounded-2xl
                                border
                                bg-white
                                p-4
                                shadow-sm
                            "
                        >
                            {/* Payment mode */}

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Payment Mode
                                </label>

                                <Select
                                    value={paymentMode}
                                    onValueChange={(value) =>
                                        setPaymentMode(
                                            value as PaymentMode
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        className="
                                            h-11
                                            w-full
                                            rounded-xl
                                            bg-muted/20
                                        "
                                    >
                                        <SelectValue placeholder="Select payment mode" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="CASH">
                                            Cash
                                        </SelectItem>

                                        <SelectItem value="UPI">
                                            UPI
                                        </SelectItem>

                                        <SelectItem value="BANK">
                                            Bank
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Amount */}

                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-3">
                                    <label
                                        htmlFor="customer-payment-amount"
                                        className="text-sm font-medium"
                                    >
                                        Amount
                                    </label>

                                    <span className="shrink-0 text-xs text-muted-foreground">
                                        {outstanding > 0
                                            ? `बाकी ₹${outstanding.toLocaleString(
                                                  "en-IN"
                                              )}`
                                            : "Future sale advance"}
                                    </span>
                                </div>

                                <div className="relative">
                                    <IndianRupee
                                        className="
                                            absolute
                                            left-3
                                            top-3.5
                                            h-4
                                            w-4
                                            text-muted-foreground
                                        "
                                    />

                                    <Input
                                        id="customer-payment-amount"
                                        type="number"
                                        min={1}
                                        placeholder="Enter amount"
                                        value={amount}
                                        onChange={(event) =>
                                            setAmount(
                                                event.target.value
                                            )
                                        }
                                        className="
                                            h-12
                                            w-full
                                            rounded-xl
                                            bg-muted/20
                                            pl-9
                                            text-base
                                            font-medium
                                            focus-visible:border-amber-500
                                            focus-visible:ring-amber-500/20
                                        "
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment summary */}

                        {paymentAmount > 0 && (
                            <div
                                className="
                                    rounded-2xl
                                    border
                                    bg-[#faf9f6]
                                    p-4
                                "
                            >
                                <p className="text-sm font-semibold">
                                    Payment Summary
                                </p>

                                <div className="mt-3 space-y-2.5">
                                    <div className="flex items-center justify-between gap-4 text-sm">
                                        <span className="text-muted-foreground">
                                            Payment
                                        </span>

                                        <span className="font-medium">
                                            ₹
                                            {paymentAmount.toLocaleString(
                                                "en-IN"
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 text-sm">
                                        <span className="text-muted-foreground">
                                            Current outstanding
                                        </span>

                                        <span className="font-medium">
                                            ₹
                                            {outstanding.toLocaleString(
                                                "en-IN"
                                            )}
                                        </span>
                                    </div>

                                    {unallocatedPreview > 0 && (
                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-4
                                                border-t
                                                pt-3
                                                text-sm
                                            "
                                        >
                                            <span className="font-medium text-amber-700">
                                                Advance
                                            </span>

                                            <span className="font-bold text-amber-700">
                                                ₹
                                                {unallocatedPreview.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {outstanding > 0 &&
                                    paymentAmount <=
                                        outstanding && (
                                        <p
                                            className="
                                                mt-3
                                                border-t
                                                pt-3
                                                text-xs
                                                leading-5
                                                text-muted-foreground
                                            "
                                        >
                                            Payment will be automatically
                                            applied to the oldest
                                            outstanding sales first.
                                        </p>
                                    )}

                                {outstanding <= 0 && (
                                    <p
                                        className="
                                            mt-3
                                            border-t
                                            pt-3
                                            text-xs
                                            leading-5
                                            text-amber-700
                                        "
                                    >
                                        This entire payment will be
                                        stored as an advance for
                                        future sales.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}

                <DialogFooter
                    className="
                        shrink-0
                        border-t
                        bg-[#faf9f6]
                        px-5
                        py-3
                        sm:px-6
                        sm:py-4
                    "
                >
                    <div className="flex w-full justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() =>
                                onOpenChange(false)
                            }
                            disabled={loading}
                            className="rounded-xl"
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleSave}
                            disabled={
                                loading ||
                                !amount ||
                                paymentAmount <= 0
                            }
                            className="
                                rounded-xl
                                bg-amber-600
                                font-semibold
                                text-white
                                shadow-sm
                                hover:bg-amber-700
                            "
                        >
                            {loading
                                ? "Saving..."
                                : "Save Payment"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}