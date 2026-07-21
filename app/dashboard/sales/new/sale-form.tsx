"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { saleSchema, SaleFormValues } from "./schema";
import { useEffect, useState, useRef } from "react";
import { ProductRates } from "@/lib/google/types";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils/format";

export function SaleForm() {
    const form = useForm<
        z.input<typeof saleSchema>,
        unknown,
        SaleFormValues
    >({
        resolver: zodResolver(saleSchema),

        defaultValues: {
            customer: "",
            phone: "",
            jaggeryKg: 0,
            teaKg: 0,
            amountPaid: 0,
        },
    });
    const {
        ref: customerRef,
        ...customerField
    } = form.register("customer");

    const [rates, setRates] = useState<ProductRates>({
        jaggery: 0,
        teaPowder: 0,
    });

    const customerInputRef = useRef<HTMLInputElement>(null);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();


    useEffect(() => {
        async function loadRates() {
            const response = await fetch("/api/rates");
            const data = await response.json();

            setRates(data);
        }

        loadRates();
    }, []);

    const jaggeryKg = Number(form.watch("jaggeryKg"));
    const teaKg = Number(form.watch("teaKg"));
    const amountPaid = Number(form.watch("amountPaid"));

    const total = jaggeryKg * rates.jaggery + teaKg * rates.teaPowder;

    const remaining = Math.max(
        total - amountPaid,
        0
    );

    const paymentStatus =
        remaining === 0 ? "Paid" : "Credit";

    async function onSubmit(data: SaleFormValues) {
        setIsSaving(true);

        try {
            const response = await fetch("/api/sales", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Sale added successfully!");

                router.push("/dashboard");
                router.refresh();
            } else {
                toast.error("Failed to add sale.");
            }
        } catch (error) {
            console.error(error);

            toast.error("Something went wrong.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Sale Details</CardTitle>
                <CardDescription>
                    Enter customer and product information.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-2">
                        <Label htmlFor="customer">Customer Name</Label>
                        <Input
                            id="customer"
                            placeholder="Customer Name"
                            {...customerField}
                            ref={(element) => {
                                customerRef(element);
                                customerInputRef.current = element;
                            }}
                        />
                        {form.formState.errors.customer && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.customer.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            placeholder="Customer Number"
                            {...form.register("phone")}
                        />
                        {form.formState.errors.phone && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.phone.message}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="jaggeryKg">
                                Jaggery (₹{rates.jaggery}/kg)
                            </Label>                            <Input
                                id="jaggeryKg"
                                type="number"
                                step="0.1"
                                {...form.register("jaggeryKg", {
                                    valueAsNumber: true,
                                })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="teaKg">
                                Tea Powder (₹{rates.teaPowder}/kg)
                            </Label>                            <Input
                                id="teaKg"
                                type="number"
                                step="0.1"
                                {...form.register("teaKg", {
                                    valueAsNumber: true,
                                })}
                            />
                        </div>
                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="amountPaid">Amount Paid (₹)</Label>

                        <Input
                            id="amountPaid"
                            type="number"
                            placeholder="Enter paid amount"
                            {...form.register("amountPaid", {
                                valueAsNumber: true,
                            })}
                        />

                        {form.formState.errors.amountPaid && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.amountPaid.message}
                            </p>
                        )}
                    </div>


                    <div className="rounded-lg border bg-muted/30 p-5 space-y-3">
                        <div className="flex justify-between text-lg font-semibold">
                            <span>Total</span>
                            <span>{formatCurrency(total)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Paid</span>
                            <span>{formatCurrency(amountPaid)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Remaining</span>
                            <span>{formatCurrency(remaining)}</span>
                        </div>

                        <hr />

                        <div className="flex justify-between font-bold">
                            <span>Status</span>

                            <span
                                className={
                                    paymentStatus === "Paid"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }
                            >
                                {paymentStatus}
                            </span>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isSaving}
                        className="w-full"
                    >
                        {isSaving ? "Saving..." : "Save Sale"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}