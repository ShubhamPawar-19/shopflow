"use client";
import { Button } from "@/components/ui/button";
import { Payment, PaymentMode, Sale } from "@/lib/google/types";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

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
    const [paymentMode, setPaymentMode] = useState<PaymentMode>("CASH");
    const [payments, setPayments] = useState<Payment[]>([]);
    const [remainingAmount, setRemainingAmount] = useState(
        sale.amountRemaining
    );
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
            console.error(error);
        }
    }

    useEffect(() => {
        if (open) {
            fetchPayments();
        }
    }, [open, sale.id]);

    async function handleSavePayment() {
        if (!amount || Number(amount) <= 0) {
            toast.error("Please enter a valid amount.");
            return;
        }

        if (Number(amount) > remainingAmount) {
            toast.error(
                `Amount cannot exceed ₹${remainingAmount}`
            );
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/payments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    saleId: sale.id,
                    customer: sale.customer,
                    phone: sale.phone,
                    amount: Number(amount),
                    paymentMode,
                }),
            });

            const result = await response.json();

            if (!result.success) {
                toast.error(result.error ?? "Failed to save payment");
                return;
            }

            toast.success("Payment added");

            setAmount("");

            await fetchPayments();

            setRemainingAmount(
                remainingAmount - Number(amount)
            );

            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add Payment
                    </DialogTitle>
                    <div className="rounded-md bg-muted p-3 text-sm">
                        <div className="font-medium">
                            {sale.customer}
                        </div>

                        <div className="text-muted-foreground">
                            Remaining: ₹{remainingAmount}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Previous Payments
                        </label>

                        {payments.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No payments yet
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {payments.map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="flex justify-between rounded-md border p-2 text-sm"
                                    >
                                        <div>
                                            <div className="font-medium">
                                                {payment.paymentMode}
                                            </div>

                                            <div className="text-muted-foreground">
                                                {new Date(payment.date).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <div className="font-medium">
                                            ₹{payment.amount}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Amount
                        </label>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Payment Mode
                            </label>

                            <Select
                                value={paymentMode}
                                onValueChange={(value) =>
                                    setPaymentMode(value as "CASH" | "UPI" | "BANK")
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="CASH">Cash</SelectItem>
                                    <SelectItem value="UPI">UPI</SelectItem>
                                    <SelectItem value="BANK">Bank</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Input
                            type="number"
                            placeholder={`Max ₹${remainingAmount}`}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        onClick={handleSavePayment}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Payment"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}