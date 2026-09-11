"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Calculator,
  IndianRupee,
  Package,
  Phone,
  Save,
  User,
} from "lucide-react";

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
import { Badge } from "@/components/ui/badge";

import { saleSchema, SaleFormValues } from "./schema";
import { ProductRates } from "@/lib/google/types";
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
      quantity: undefined,
      amountPaid: undefined,
    },
  });

  const [rates, setRates] = useState<ProductRates>({
    pouch: 70,
  });

  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function loadRates() {
      try {
        const response = await fetch("/api/rates");
        const data = await response.json();

        setRates(data);
      } catch (error) {
        console.error("Failed to load rates:", error);
      }
    }

    loadRates();
  }, []);

  const quantity =
    Number(form.watch("quantity")) || 0;

  const amountPaid =
    Number(form.watch("amountPaid")) || 0;

  const total = quantity * rates.pouch;

  const remaining = Math.max(
    total - amountPaid,
    0
  );

  const paymentStatus =
    remaining === 0 && total > 0
      ? "Paid"
      : "Credit";

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
        toast.success(
          "विक्री यशस्वीरित्या जोडली!"
        );

        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(
          "विक्री जोडण्यात अडचण आली."
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(
        "काहीतरी चूक झाली."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto mt-8 max-w-2xl">

      {/* Page Intro */}

      <div className="mb-6 flex items-start gap-4">

        <div className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-2xl
          bg-amber-100
          text-amber-700
        ">
          <Package className="h-6 w-6" />
        </div>

        <div>
          <h1 className="
            text-2xl
            font-bold
            tracking-tight
          ">
            नवीन विक्री
          </h1>

          <p className="
            mt-1
            text-sm
            text-muted-foreground
          ">
            फ्रँचायझी ग्राहकाची नवीन विक्री नोंदवा.
          </p>
        </div>

      </div>


      <Card className="
        overflow-hidden
        border-border/70
        shadow-sm
      ">

        {/* Card Header */}

        <CardHeader className="
          border-b
          bg-gradient-to-r
          from-amber-50/80
          to-white
          px-6
          py-5
        ">

          <div className="
            flex
            items-center
            justify-between
            gap-4
          ">

            <div>
              <CardTitle className="text-lg">
                विक्री माहिती
              </CardTitle>

              <CardDescription className="mt-1">
                ग्राहक आणि ऑर्डरची माहिती भरा.
              </CardDescription>
            </div>

            {/* Current Rate */}

            <div className="
              hidden
              rounded-xl
              border
              border-amber-200
              bg-amber-50
              px-4
              py-2
              text-right
              sm:block
            ">
              <p className="
                text-[11px]
                font-medium
                uppercase
                tracking-wide
                text-amber-700
              ">
                पाऊच रेट
              </p>

              <p className="
                mt-0.5
                text-lg
                font-bold
                text-amber-900
              ">
                ₹{rates.pouch}
              </p>
            </div>

          </div>

        </CardHeader>


        <CardContent className="p-6">

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-7"
          >

            {/* Customer Section */}

            <div className="space-y-4">

              <div className="
                flex
                items-center
                gap-2
                text-sm
                font-semibold
              ">
                <User className="h-4 w-4 text-amber-600" />
                ग्राहक माहिती
              </div>


              {/* Customer */}

              <div className="space-y-2">

                <Label htmlFor="customer">
                  ग्राहक / फ्रँचायझी नाव
                </Label>

                <Input
                  id="customer"
                  placeholder="ग्राहकाचं नाव"
                  className="
                    h-11
                    bg-muted/20
                    focus-visible:border-amber-500
                    focus-visible:ring-amber-500/20
                  "
                  {...form.register("customer")}
                />

                {form.formState.errors.customer && (
                  <p className="text-sm text-red-500">
                    {
                      form.formState.errors.customer.message
                    }
                  </p>
                )}

              </div>


              {/* Phone */}

              <div className="space-y-2">

                <Label
                  htmlFor="phone"
                  className="flex items-center gap-2"
                >
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  मोबाईल नंबर
                </Label>

                <Input
                  id="phone"
                  type="tel"
                  placeholder="ग्राहकाचा मोबाईल नंबर"
                  className="
                    h-11
                    bg-muted/20
                    focus-visible:border-amber-500
                    focus-visible:ring-amber-500/20
                  "
                  {...form.register("phone")}
                />

                {form.formState.errors.phone && (
                  <p className="text-sm text-red-500">
                    {
                      form.formState.errors.phone.message
                    }
                  </p>
                )}

              </div>

            </div>


            {/* Order Section */}

            <div className="
              border-t
              pt-6
              space-y-4
            ">

              <div className="
                flex
                items-center
                gap-2
                text-sm
                font-semibold
              ">
                <Package className="h-4 w-4 text-amber-600" />
                ऑर्डर माहिती
              </div>


              {/* Quantity */}

              <div className="space-y-2">

                <div className="
                  flex
                  items-center
                  justify-between
                ">
                  <Label htmlFor="quantity">
                    पाऊच संख्या
                  </Label>

                  <span className="
                    text-xs
                    font-medium
                    text-amber-700
                  ">
                    ₹{rates.pouch} / पाऊच
                  </span>
                </div>

                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  placeholder="किती पाऊच?"
                  className="
                    h-11
                    bg-muted/20
                    focus-visible:border-amber-500
                    focus-visible:ring-amber-500/20
                  "
                  {...form.register(
                    "quantity",
                    {
                      valueAsNumber: true,
                    }
                  )}
                />

                {form.formState.errors.quantity && (
                  <p className="text-sm text-red-500">
                    {
                      form.formState.errors.quantity.message
                    }
                  </p>
                )}

              </div>


              {/* Amount Paid */}

              <div className="space-y-2">

                <Label
                  htmlFor="amountPaid"
                  className="flex items-center gap-2"
                >
                  <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                  मिळालेली रक्कम
                </Label>

                <Input
                  id="amountPaid"
                  type="number"
                  min={0}
                  placeholder="ग्राहकाकडून मिळालेली रक्कम"
                  className="
                    h-11
                    bg-muted/20
                    focus-visible:border-amber-500
                    focus-visible:ring-amber-500/20
                  "
                  {...form.register(
                    "amountPaid",
                    {
                      valueAsNumber: true,
                    }
                  )}
                />

                {form.formState.errors.amountPaid && (
                  <p className="text-sm text-red-500">
                    {
                      form.formState.errors.amountPaid.message
                    }
                  </p>
                )}

              </div>

            </div>


            {/* Summary */}

            <div className="
              overflow-hidden
              rounded-2xl
              border
              border-amber-200
              bg-gradient-to-br
              from-amber-50
              via-white
              to-white
            ">

              {/* Summary Header */}

              <div className="
                flex
                items-center
                gap-2
                border-b
                border-amber-100
                px-5
                py-4
              ">

                <div className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-amber-100
                  text-amber-700
                ">
                  <Calculator className="h-4 w-4" />
                </div>

                <div>
                  <p className="font-semibold">
                    पेमेंट सारांश
                  </p>

                  <p className="
                    text-xs
                    text-muted-foreground
                  ">
                    ऑर्डरची एकूण रक्कम
                  </p>
                </div>

              </div>


              <div className="space-y-4 p-5">

                {/* Total */}

                <div className="
                  flex
                  items-center
                  justify-between
                ">
                  <span className="text-sm text-muted-foreground">
                    एकूण रक्कम
                  </span>

                  <span className="
                    text-xl
                    font-bold
                  ">
                    {formatCurrency(total)}
                  </span>
                </div>


                {/* Paid */}

                <div className="
                  flex
                  items-center
                  justify-between
                ">
                  <span className="text-sm text-muted-foreground">
                    मिळाले
                  </span>

                  <span className="
                    font-semibold
                    text-green-600
                  ">
                    {formatCurrency(amountPaid)}
                  </span>
                </div>


                {/* Remaining */}

                <div className="
                  flex
                  items-center
                  justify-between
                ">
                  <span className="text-sm text-muted-foreground">
                    बाकी
                  </span>

                  <span className="
                    font-semibold
                    text-red-600
                  ">
                    {formatCurrency(remaining)}
                  </span>
                </div>


                {/* Status */}

                <div className="
                  flex
                  items-center
                  justify-between
                  border-t
                  border-amber-100
                  pt-4
                ">

                  <span className="font-semibold">
                    पेमेंट स्थिती
                  </span>

                  {paymentStatus === "Paid" ? (
                    <Badge
                      className="
                        gap-1.5
                        border-green-200
                        bg-green-50
                        text-green-700
                        hover:bg-green-50
                      "
                    >
                      <BadgeCheck className="h-3.5 w-3.5" />
                      पूर्ण भरले
                    </Badge>
                  ) : (
                    <Badge
                      className="
                        border-red-200
                        bg-red-50
                        text-red-700
                        hover:bg-red-50
                      "
                    >
                      बाकी आहे
                    </Badge>
                  )}

                </div>

              </div>

            </div>


            {/* Save Button */}

            <Button
              type="submit"
              disabled={isSaving}
              className="
                h-12
                w-full
                bg-amber-600
                text-base
                font-semibold
                text-white
                shadow-sm
                transition-all
                hover:bg-amber-700
                hover:shadow-md
              "
            >

              <Save className="mr-2 h-4 w-4" />

              {isSaving
                ? "जतन करत आहे..."
                : "विक्री जतन करा"}

            </Button>

          </form>

        </CardContent>

      </Card>

    </div>
  );
}