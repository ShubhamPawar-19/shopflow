"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  IndianRupee,
  Package,
  User,
  Phone,
  Save,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Sale } from "@/lib/google/types";
import { formatCurrency } from "@/lib/utils/format";

interface EditSaleDialogProps {
  sale: Sale;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getDateInputValue(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const year = parsedDate.getFullYear();
  const month = String(
    parsedDate.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    parsedDate.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function EditSaleDialog({
  sale,
  open,
  onOpenChange,
}: EditSaleDialogProps) {
  const router = useRouter();

  const [customer, setCustomer] =
    useState(sale.customer);

  const [phone, setPhone] =
    useState(sale.phone);

  const [date, setDate] =
    useState(getDateInputValue(sale.date));

  const [quantity, setQuantity] =
    useState(String(sale.quantity));

  const [amountPaid, setAmountPaid] =
    useState(String(sale.amountPaid));

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (!open) return;

    setCustomer(sale.customer);
    setPhone(sale.phone);
    setDate(getDateInputValue(sale.date));
    setQuantity(String(sale.quantity));
    setAmountPaid(String(sale.amountPaid));
  }, [open, sale]);

  const quantityNumber =
    Number(quantity) || 0;

  const amountPaidNumber =
    Number(amountPaid) || 0;

  const total =
    quantityNumber * sale.pouchRate;

  const remaining = Math.max(
    total - amountPaidNumber,
    0
  );

  const paymentStatus =
    remaining === 0 && total > 0
      ? "Paid"
      : "Credit";

  const amountExceedsTotal =
    amountPaidNumber > total;

  async function handleSave() {
    if (!customer.trim()) {
      toast.error("Customer name is required.");
      return;
    }

    if (!phone.trim()) {
      toast.error("Phone number is required.");
      return;
    }

    if (!date) {
      toast.error("Sale date is required.");
      return;
    }

    if (quantityNumber <= 0) {
      toast.error(
        "Quantity must be greater than 0."
      );
      return;
    }

    if (amountPaidNumber < 0) {
      toast.error(
        "Amount paid cannot be negative."
      );
      return;
    }

    if (amountExceedsTotal) {
      toast.error(
        "Amount paid cannot exceed total."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/sales/${sale.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "edit",
            date,
            customer: customer.trim(),
            phone: phone.trim(),
            quantity: quantityNumber,
            amountPaid: amountPaidNumber,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "Failed to update sale"
        );
      }

      toast.success(
        "Sale updated successfully"
      );

      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error(
        "Edit sale error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update sale"
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
      <DialogContent className="flex max-h-[90vh] max-w-md flex-col overflow-hidden rounded-2xl p-1">
        <DialogHeader className="border-b bg-linear-to-r from-amber-50/80 to-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Package className="h-5 w-5" />
            </div>

            <div>
              <DialogTitle className="text-xl font-bold">
                Edit Sale
              </DialogTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                विक्रीची माहिती बदला
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6">
          {/* Customer */}
          <div className="space-y-2">
            <label
              htmlFor="edit-customer"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              Customer
            </label>

            <Input
              id="edit-customer"
              value={customer}
              onChange={(e) =>
                setCustomer(e.target.value)
              }
              placeholder="Customer name"
              className="h-11 rounded-xl bg-muted/20 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label
              htmlFor="edit-phone"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Phone className="h-4 w-4 text-muted-foreground" />
              Phone
            </label>

            <Input
              id="edit-phone"
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="Phone number"
              className="h-11 rounded-xl bg-muted/20 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label
              htmlFor="edit-date"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              Sale Date
            </label>

            <Input
              id="edit-date"
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              className="h-11 rounded-xl bg-muted/20 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
            />

            <p className="text-xs text-muted-foreground">
              चुकीची तारीख असल्यास येथे दुरुस्त करा.
            </p>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="edit-quantity"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Package className="h-4 w-4 text-muted-foreground" />
                Quantity
              </label>

              <span className="text-xs text-muted-foreground">
                Rate: {formatCurrency(sale.pouchRate)}
              </span>
            </div>

            <Input
              id="edit-quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
              placeholder="Enter quantity"
              className="h-11 rounded-xl bg-muted/20 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
            />
          </div>

          {/* Amount Paid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="edit-amount-paid"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                Amount Paid
              </label>

              <span className="text-xs text-muted-foreground">
                Max {formatCurrency(total)}
              </span>
            </div>

            <div className="relative">
              <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Input
                id="edit-amount-paid"
                type="number"
                min={0}
                max={total}
                value={amountPaid}
                onChange={(e) =>
                  setAmountPaid(e.target.value)
                }
                placeholder="Enter amount"
                className="
                  h-11
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

            {amountExceedsTotal && (
              <p className="text-xs font-medium text-red-600">
                Amount paid cannot exceed total.
              </p>
            )}
          </div>

          {/* Summary */}
          <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold">
                Updated Summary
              </p>

              <Badge
                className={
                  paymentStatus === "Paid"
                    ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-50"
                    : "border-red-200 bg-red-50 text-red-700 hover:bg-red-50"
                }
              >
                {paymentStatus}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Total
                </span>

                <span className="font-semibold">
                  {formatCurrency(total)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Paid
                </span>

                <span className="font-semibold text-green-600">
                  {formatCurrency(
                    amountPaidNumber
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-amber-200/60 pt-2">
                <span className="font-medium">
                  Remaining
                </span>

                <span
                  className={
                    remaining > 0
                      ? "font-bold text-red-600"
                      : "font-bold text-green-600"
                  }
                >
                  {formatCurrency(remaining)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="shrink-0 border-t bg-[#faf9f6] px-6 py-4">
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
              amountExceedsTotal
            }
            className="rounded-xl bg-amber-600 font-semibold text-white shadow-sm hover:bg-amber-700"
          >
            <Save className="mr-2 h-4 w-4" />

            {loading
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}