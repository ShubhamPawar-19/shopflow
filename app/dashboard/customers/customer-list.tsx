"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Search,
    ShoppingBag,
    Trash2,
    Phone,
    CalendarDays,
    ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";

import { CustomerSummary } from "@/lib/google/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
    formatCurrency,
    formatDate,
} from "@/lib/utils/format";

interface Props {
    customers: CustomerSummary[];
}

export function CustomerList({
    customers,
}: Props) {
    const [search, setSearch] = useState("");

    const [deleteDialogOpen, setDeleteDialogOpen] =
        useState(false);

    const [customerToDelete, setCustomerToDelete] =
        useState<CustomerSummary | null>(null);

    const [deleting, setDeleting] = useState(false);

    const filteredCustomers = customers.filter(
        (customer) =>
            customer.customer
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            customer.phone.includes(search)
    );

    async function handleDeleteCustomer() {
        if (!customerToDelete) return;

        setDeleting(true);

        try {
            const response = await fetch(
                `/api/customers/${encodeURIComponent(
                    customerToDelete.phone
                )}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.error || "Failed to delete customer"
                );
            }

            toast.success("Customer deleted successfully");

            setDeleteDialogOpen(false);
            setCustomerToDelete(null);

            window.location.reload();
        } catch (error) {
            console.error(
                "Delete customer error:",
                error
            );

            toast.error("Failed to delete customer");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <div className="space-y-6">

            {/* Search */}

            <div className="relative">

                <Search className="
                    absolute
                    left-3.5
                    top-3.5
                    h-4
                    w-4
                    text-muted-foreground
                " />

                <Input
                    className="
                        h-11
                        rounded-xl
                        border-border/70
                        bg-white
                        pl-10
                        shadow-sm
                        focus-visible:border-amber-500
                        focus-visible:ring-amber-500/20
                    "
                    placeholder="ग्राहक शोधा किंवा मोबाईल नंबर टाका..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>


            {/* Search Result Count */}

            {customers.length > 0 && (
                <div className="
                    flex
                    items-center
                    justify-between
                    px-1
                ">

                    <p className="
                        text-sm
                        text-muted-foreground
                    ">
                        {search
                            ? `${filteredCustomers.length} ग्राहक सापडले`
                            : `${customers.length} ग्राहक`
                        }
                    </p>

                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="
                                text-xs
                                font-medium
                                text-amber-700
                                hover:text-amber-800
                            "
                        >
                            शोध साफ करा
                        </button>
                    )}

                </div>
            )}


            {/* Empty State */}

            {filteredCustomers.length === 0 && (
                <div className="
                    rounded-2xl
                    border
                    border-dashed
                    bg-white
                    p-12
                    text-center
                    shadow-sm
                ">

                    <div className="
                        mx-auto
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-amber-50
                        text-amber-600
                    ">
                        <ShoppingBag className="h-7 w-7" />
                    </div>

                    <p className="
                        mt-4
                        font-semibold
                    ">
                        कोणताही ग्राहक सापडला नाही
                    </p>

                    <p className="
                        mt-1
                        text-sm
                        text-muted-foreground
                    ">
                        वेगळे नाव किंवा मोबाईल नंबर शोधा.
                    </p>

                </div>
            )}


            {/* Customer Cards */}

            <div className="grid gap-4">

                {filteredCustomers.map((customer) => (

                    <div
                        key={customer.phone}
                        className="
                            group
                            overflow-hidden
                            rounded-2xl
                            border
                            bg-white
                            shadow-sm
                            transition-all
                            duration-200
                            hover:-translate-y-0.5
                            hover:border-amber-200
                            hover:shadow-md
                        "
                    >

                        {/* Main Customer Information */}

                        <div className="
                            p-5
                            sm:p-6
                        ">

                            <div className="
                                flex
                                flex-col
                                gap-5
                                md:flex-row
                                md:items-center
                                md:justify-between
                            ">

                                {/* Customer Info */}

                                <Link
                                    href={`/dashboard/customers/${customer.phone}`}
                                    className="
                                        min-w-0
                                        flex-1
                                        rounded-xl
                                        outline-none
                                    "
                                >

                                    <div className="
                                        flex
                                        items-start
                                        gap-4
                                    ">

                                        {/* Avatar */}

                                        <div className="
                                            flex
                                            h-12
                                            w-12
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-amber-50
                                            text-lg
                                            font-bold
                                            text-amber-700
                                            ring-1
                                            ring-amber-100
                                        ">
                                            {customer.customer
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>


                                        <div className="min-w-0">

                                            <div className="
                                                flex
                                                flex-wrap
                                                items-center
                                                gap-2
                                            ">

                                                <h2 className="
                                                    truncate
                                                    text-lg
                                                    font-bold
                                                    tracking-tight
                                                    transition-colors
                                                    group-hover:text-amber-700
                                                ">
                                                    {customer.customer}
                                                </h2>

                                                <Badge
                                                    variant="secondary"
                                                    className="
                                                        border-amber-100
                                                        bg-amber-50
                                                        text-amber-700
                                                        hover:bg-amber-50
                                                    "
                                                >
                                                    Franchise
                                                </Badge>

                                            </div>


                                            {/* Phone */}

                                            <div className="
                                                mt-2
                                                flex
                                                items-center
                                                gap-1.5
                                                text-sm
                                                text-muted-foreground
                                            ">

                                                <Phone className="h-3.5 w-3.5" />

                                                <span>
                                                    {customer.phone}
                                                </span>

                                            </div>


                                            {/* Last Purchase */}

                                            <div className="
                                                mt-2
                                                flex
                                                items-center
                                                gap-1.5
                                                text-xs
                                                text-muted-foreground
                                            ">

                                                <CalendarDays className="h-3.5 w-3.5" />

                                                <span>
                                                    शेवटची खरेदी:{" "}
                                                    {formatDate(
                                                        customer.lastPurchase
                                                    )}
                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                </Link>


                                {/* Purchase Summary */}

                                <div className="
                                    rounded-xl
                                    border
                                    bg-[#faf9f6]
                                    px-5
                                    py-3
                                    md:min-w-[190px]
                                ">

                                    <div className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-6
                                        md:block
                                    ">

                                        <div>
                                            <p className="
                                                text-xs
                                                font-medium
                                                text-muted-foreground
                                            ">
                                                एकूण खरेदी
                                            </p>

                                            <p className="
                                                mt-1
                                                text-xl
                                                font-bold
                                                tracking-tight
                                            ">
                                                {formatCurrency(
                                                    customer.totalPurchases
                                                )}
                                            </p>
                                        </div>


                                        <div className="
                                            flex
                                            items-center
                                            gap-1.5
                                            text-xs
                                            text-muted-foreground
                                            md:mt-1
                                        ">

                                            <ShoppingCart className="h-3.5 w-3.5" />

                                            <span>
                                                {customer.salesCount} orders
                                            </span>

                                        </div>

                                    </div>

                                </div>


                                {/* Delete */}

                                <div className="
                                    flex
                                    justify-end
                                ">

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="
                                            h-9
                                            text-muted-foreground
                                            hover:bg-red-50
                                            hover:text-red-600
                                        "
                                        onClick={() => {
                                            setCustomerToDelete(
                                                customer
                                            );

                                            setDeleteDialogOpen(
                                                true
                                            );
                                        }}
                                    >

                                        <Trash2 className="h-4 w-4" />

                                        <span className="ml-1.5">
                                            Delete
                                        </span>

                                    </Button>

                                </div>

                            </div>

                        </div>


                        {/* Outstanding Footer */}

                        <div className="
                            border-t
                            bg-[#faf9f6]
                            px-5
                            py-3.5
                            sm:px-6
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                            ">

                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                ">

                                    <div className="
                                        h-2
                                        w-2
                                        rounded-full
                                        bg-red-500
                                    " />

                                    <span className="
                                        text-sm
                                        font-medium
                                        text-muted-foreground
                                    ">
                                        बाकी रक्कम
                                    </span>

                                </div>


                                <span
                                    className={
                                        customer.outstanding > 0
                                            ? "font-bold text-red-600"
                                            : "font-bold text-green-600"
                                    }
                                >
                                    {customer.outstanding > 0
                                        ? formatCurrency(
                                            customer.outstanding
                                        )
                                        : "Paid"
                                    }
                                </span>

                            </div>

                        </div>

                    </div>

                ))}

            </div>


            {/* Delete Confirmation */}

            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >

                <AlertDialogContent>

                    <AlertDialogHeader>

                        <AlertDialogTitle>
                            Delete this customer?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This will permanently delete{" "}
                            <span className="font-semibold">
                                {customerToDelete?.customer}
                            </span>
                            {" "}and all of their orders and
                            payment history. This action cannot
                            be undone.
                        </AlertDialogDescription>

                    </AlertDialogHeader>


                    <AlertDialogFooter>

                        <AlertDialogCancel
                            disabled={deleting}
                        >
                            Cancel
                        </AlertDialogCancel>


                        <AlertDialogAction
                            onClick={handleDeleteCustomer}
                            disabled={deleting}
                            className="
                                bg-destructive
                                text-destructive-foreground
                                hover:bg-destructive/90
                            "
                        >
                            {deleting
                                ? "Deleting..."
                                : "Delete Customer"
                            }
                        </AlertDialogAction>

                    </AlertDialogFooter>

                </AlertDialogContent>

            </AlertDialog>

        </div>
    );
}