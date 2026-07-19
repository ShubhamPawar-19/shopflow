"use client";

import { useState } from "react";
import Link from "next/link";
import { CustomerSummary } from "@/lib/google/types";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/utils/format";

interface Props {
    customers: CustomerSummary[];
}

export function CustomerList({ customers }: Props) {
    const [search, setSearch] = useState("");

    const filteredCustomers = customers.filter((customer) =>
        customer.customer
            .toLowerCase()
            .includes(search.toLowerCase()) ||
        customer.phone.includes(search)
    );

    return (
        <div className="space-y-6">
            <Input
                placeholder="Search by customer or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="grid gap-4">
                {filteredCustomers.map((customer) => (
                    <Link
                        key={customer.phone}
                        href={`/dashboard/customers/${customer.phone}`}
                        className="block rounded-lg border p-5 hover:bg-muted/40 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    {customer.customer}
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    {customer.phone}
                                </p>

                                <p className="text-xs text-muted-foreground mt-1">
                                    Last Purchase: {formatDate(customer.lastPurchase)}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="font-semibold">
                                    {formatCurrency(customer.totalPurchases)}
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    {customer.salesCount} sale
                                    {customer.salesCount > 1 ? "s" : ""}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-between text-sm">
                            <span>Outstanding</span>

                            <span
                                className={
                                    customer.outstanding > 0
                                        ? "text-red-600 font-medium"
                                        : "text-green-600 font-medium"
                                }
                            >
                                {formatCurrency(customer.outstanding)}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}