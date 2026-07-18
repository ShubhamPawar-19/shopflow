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
import { useState } from "react";
import { useRef } from "react";

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
            paymentStatus: "Paid",
        },
    });
    const {
        ref: customerRef,
        ...customerField
    } = form.register("customer");

    const customerInputRef = useRef<HTMLInputElement>(null);
    const [isSaving, setIsSaving] = useState(false);

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

                form.reset();

                customerInputRef.current?.focus();
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
                            <Label htmlFor="jaggeryKg">Jaggery (kg)</Label>
                            <Input
                                id="jaggeryKg"
                                type="number"
                                step="0.1"
                                {...form.register("jaggeryKg", {
                                    valueAsNumber: true,
                                })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="teaKg">Tea Powder (kg)</Label>
                            <Input
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
                        <Label htmlFor="paymentStatus">Payment Status</Label>

                        <select
                            id="paymentStatus"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            {...form.register("paymentStatus")}
                        >
                            <option value="Paid">Paid</option>
                            <option value="Credit">Credit</option>
                        </select>
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