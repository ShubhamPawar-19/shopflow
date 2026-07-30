"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";

import { CustomerSummary } from "@/lib/google/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                <Input
                    className="pl-10"
                    placeholder="ग्राहक शोधा किंवा मोबाईल नंबर टाका..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />
            </div>


            {/* Empty State */}
            {filteredCustomers.length === 0 && (
                <div className="rounded-xl border p-10 text-center">

                    <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />

                    <p className="mt-3 text-muted-foreground">
                        कोणताही ग्राहक सापडला नाही
                    </p>

                </div>
            )}


            {/* Customer Cards */}
            <div className="grid gap-4">

                {filteredCustomers.map((customer) => (

                    <Link
                        key={customer.phone}
                        href={`/dashboard/customers/${customer.phone}`}
                        className="
                        block rounded-xl border p-5
                        hover:bg-muted/40
                        transition-all
                        hover:shadow-sm
                        "
                    >

                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">


                            {/* Customer Info */}
                            <div>

                                <div className="flex items-center gap-3">

                                    <h2 className="text-xl font-semibold">
                                        {customer.customer}
                                    </h2>


                                    <Badge variant="secondary">
                                        Franchise
                                    </Badge>

                                </div>


                                <p className="mt-1 text-sm text-muted-foreground">
                                    📱 {customer.phone}
                                </p>


                                <p className="mt-2 text-xs text-muted-foreground">
                                    शेवटची खरेदी:{" "}
                                    {formatDate(customer.lastPurchase)}
                                </p>

                            </div>



                            {/* Purchase Summary */}
                            <div className="text-left md:text-right space-y-2">

                                <p className="text-sm text-muted-foreground">
                                    एकूण खरेदी
                                </p>


                                <p className="text-xl font-bold">
                                    {formatCurrency(
                                        customer.totalPurchases
                                    )}
                                </p>


                                <p className="text-sm text-muted-foreground">
                                    {customer.salesCount} orders
                                </p>

                            </div>

                        </div>



                        {/* Outstanding */}
                        <div
                            className="
                            mt-5 flex items-center
                            justify-between rounded-lg
                            bg-muted/40 px-4 py-3
                            "
                        >

                            <span className="text-sm font-medium">
                                बाकी रक्कम
                            </span>


                            <span
                                className={
                                    customer.outstanding > 0
                                    ? "font-bold text-red-600"
                                    : "font-bold text-green-600"
                                }
                            >

                                {customer.outstanding > 0
                                    ? formatCurrency(customer.outstanding)
                                    : "Paid"}

                            </span>

                        </div>


                    </Link>

                ))}

            </div>

        </div>
    );
}