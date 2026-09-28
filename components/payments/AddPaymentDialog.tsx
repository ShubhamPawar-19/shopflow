"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    CheckCircle2,
    CreditCard,
    IndianRupee,
    Wallet,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Payment, PaymentMode, Sale } from "@/lib/google/types";

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

interface AddPaymentDialogProps {
    sale: Sale;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddPaymentDialog({
    sale,
    open,
    onOpenChange,
}: AddPaymentDialogProps) {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const [paymentMode, setPaymentMode] =
        useState<PaymentMode>("CASH");

    const [payments, setPayments] =
        useState<Payment[]>([]);

    const [remainingAmount, setRemainingAmount] =
        useState(sale.amountRemaining);

    const router = useRouter();

    async function fetchPayments() {
        try {
            const response = await fetch(
                `/api/payments?saleId=${sale.id}`
            );

            const result = await response.json();

            if (result.success) {
                setPayments(result.data);
            }
        } catch (error) {
            console.error(
                "Failed to fetch payments:",
                error
            );
        }
    }

    useEffect(() => {
        if (!open) return;

        setAmount("");
        setPaymentMode("CASH");
        setRemainingAmount(sale.amountRemaining);

        fetchPayments();
    }, [
        open,
        sale.id,
        sale.amountRemaining,
    ]);

    async function handleSavePayment() {
        const paymentAmount = Number(amount);

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
                        saleId: sale.id,
                        customer: sale.customer,
                        phone: sale.phone,
                        amount: paymentAmount,
                        paymentMode,
                    }),
                }
            );

            const result =
                await response.json();

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.error ||
                        "Failed to save payment"
                );
            }

            const overpaidAmount =
                Math.max(
                    paymentAmount -
                        remainingAmount,
                    0
                );

            toast.success(
                overpaidAmount > 0
                    ? `Payment added. Overpaid ₹${overpaidAmount}.`
                    : "Payment added successfully."
            );

            setAmount("");

            await fetchPayments();

            setRemainingAmount(
                Math.max(
                    remainingAmount -
                        paymentAmount,
                    0
                )
            );

            router.refresh();
        } catch (error) {
            console.error(
                "Save payment error:",
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

    const paymentAmount =
        Number(amount) || 0;

    const overpaidAmount = Math.max(
        paymentAmount - remainingAmount,
        0
    );

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent
                className="
                    flex
                    max-h-[90vh]
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
                        px-6
                        py-5
                    "
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-amber-100
                                text-amber-700
                            "
                        >
                            <Wallet className="h-5 w-5" />
                        </div>

                        <div>
                            <DialogTitle className="text-xl font-bold">
                                Add Payment
                            </DialogTitle>

                            <p className="mt-1 text-sm text-muted-foreground">
                                ग्राहकाच्या पेमेंटची नोंद करा
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                {/* Scrollable Content */}

                <div
                    className="
                        min-h-0
                        flex-1
                        space-y-6
                        overflow-y-auto
                        px-6
                        py-6
                    "
                >
                    {/* Customer Summary */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-amber-100
                            bg-amber-50/60
                            p-4
                        "
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-muted-foreground">
                                    ग्राहक
                                </p>

                                <p className="mt-1 truncate font-semibold">
                                    {sale.customer}
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    {sale.phone}
                                </p>
                            </div>

                            <div className="shrink-0 text-right">
                                <p className="text-xs font-medium text-muted-foreground">
                                    बाकी रक्कम
                                </p>

                                <p
                                    className={`
                                        mt-1
                                        text-xl
                                        font-bold
                                        ${
                                            remainingAmount >
                                            0
                                                ? "text-red-600"
                                                : "text-green-600"
                                        }
                                    `}
                                >
                                    ₹
                                    {remainingAmount.toLocaleString(
                                        "en-IN"
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Previous Payments */}

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />

                                <p className="text-sm font-semibold">
                                    Previous Payments
                                </p>
                            </div>

                            {payments.length > 0 && (
                                <span
                                    className="
                                        rounded-full
                                        bg-muted
                                        px-2
                                        py-0.5
                                        text-xs
                                        font-medium
                                        text-muted-foreground
                                    "
                                >
                                    {payments.length}
                                </span>
                            )}
                        </div>

                        {payments.length === 0 ? (
                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-dashed
                                    bg-[#faf9f6]
                                    p-5
                                    text-center
                                "
                            >
                                <CreditCard className="mx-auto h-5 w-5 text-muted-foreground" />

                                <p className="mt-2 text-sm text-muted-foreground">
                                    No previous payments
                                </p>
                            </div>
                        ) : (
                            <div
                                className="
                                    max-h-40
                                    space-y-2
                                    overflow-y-auto
                                    pr-1
                                "
                            >
                                {payments.map(
                                    (payment) => (
                                        <div
                                            key={
                                                payment.id
                                            }
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                rounded-xl
                                                border
                                                bg-white
                                                p-3
                                                transition-colors
                                                hover:bg-muted/20
                                            "
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="
                                                        flex
                                                        h-8
                                                        w-8
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        bg-green-50
                                                        text-green-600
                                                    "
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </div>

                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {
                                                            payment.paymentMode
                                                        }
                                                    </p>

                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(
                                                            payment.date
                                                        ).toLocaleDateString(
                                                            "en-IN"
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="font-semibold text-green-600">
                                                +₹
                                                {payment.amount.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    {/* New Payment */}

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
                        <div className="flex items-center gap-2">
                            <div
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-amber-100
                                    text-amber-700
                                "
                            >
                                <IndianRupee className="h-4 w-4" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold">
                                    New Payment
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    पेमेंटची रक्कम आणि पद्धत निवडा
                                </p>
                            </div>
                        </div>

                        {/* Payment Mode */}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Payment Mode
                            </label>

                            <Select
                                value={paymentMode}
                                onValueChange={(
                                    value
                                ) =>
                                    setPaymentMode(
                                        value as PaymentMode
                                    )
                                }
                            >
                                <SelectTrigger
                                    className="
                                        h-11
                                        rounded-xl
                                        bg-muted/20
                                        focus:ring-amber-500/20
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
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="payment-amount"
                                    className="text-sm font-medium"
                                >
                                    Amount
                                </label>

                                <span className="text-xs text-muted-foreground">
                                    बाकी ₹
                                    {remainingAmount.toLocaleString(
                                        "en-IN"
                                    )}
                                </span>
                            </div>

                            <div className="relative">
                                <IndianRupee
                                    className="
                                        absolute
                                        left-3
                                        top-3
                                        h-4
                                        w-4
                                        text-muted-foreground
                                    "
                                />

                                <Input
                                    id="payment-amount"
                                    type="number"
                                    min={1}
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) =>
                                        setAmount(
                                            e.target.value
                                        )
                                    }
                                    className="
                                        h-12
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

                            {/* Overpayment Preview */}

                            {overpaidAmount > 0 && (
                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        rounded-xl
                                        border
                                        border-amber-200
                                        bg-amber-50
                                        px-3
                                        py-2.5
                                    "
                                >
                                    <span className="text-sm font-medium text-amber-800">
                                        जास्त मिळणार
                                    </span>

                                    <span className="font-bold text-amber-800">
                                        ₹
                                        {overpaidAmount.toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}

                <DialogFooter
                    className="
                        shrink-0
                        border-t
                        bg-[#faf9f6]
                        px-6
                        py-4
                    "
                >
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
                        onClick={handleSavePayment}
                        disabled={loading}
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
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}