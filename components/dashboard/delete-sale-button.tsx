"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

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

interface DeleteSaleButtonProps {
    saleId: string;
    customer: string;
}

export function DeleteSaleButton({
    saleId,
    customer,
}: DeleteSaleButtonProps) {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    async function handleDelete() {
        setDeleting(true);

        try {
            const response = await fetch(
                `/api/sales/${saleId}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.error || "Failed to delete sale"
                );
            }

            toast.success("Order deleted successfully");

            setOpen(false);

            router.refresh();
        } catch (error) {
            console.error("Delete sale error:", error);

            toast.error("Failed to delete order");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(true)}
                className="
                    text-muted-foreground
                    hover:bg-red-50
                    hover:text-red-600
                "
            >
                <Trash2 className="h-4 w-4" />
                Delete
            </Button>

            <AlertDialog
                open={open}
                onOpenChange={setOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete this order?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This will permanently delete the order
                            for{" "}
                            <span className="font-semibold">
                                {customer}
                            </span>
                            {" "}and all payments associated with it.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel
                            disabled={deleting}
                        >
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleting}
                            className="
                                bg-destructive
                                text-destructive-foreground
                                hover:bg-destructive/90
                            "
                        >
                            {deleting
                                ? "Deleting..."
                                : "Delete Order"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}