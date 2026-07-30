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
import { useEffect, useState } from "react";
import { ProductRates } from "@/lib/google/types";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";

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
      const response = await fetch("/api/rates");
      const data = await response.json();

      setRates(data);
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
    <Card className="mt-8 max-w-2xl mx-auto shadow-sm">

      <CardHeader>

        <CardTitle className="text-2xl">
          नवीन विक्री
        </CardTitle>

        <CardDescription>
          फ्रँचायझी ग्राहकाची विक्री माहिती भरा.
        </CardDescription>

      </CardHeader>


      <CardContent>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >

          {/* Customer */}

          <div className="space-y-2">

            <Label htmlFor="customer">
              ग्राहक / फ्रँचायझी नाव
            </Label>


            <Input
              id="customer"
              placeholder="ग्राहकाच नाव "
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

            <Label htmlFor="phone">
              मोबाईल नंबर
            </Label>


            <Input
              id="phone"
              placeholder="ग्राहकाच मोबाईल नंबर"
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



          {/* Quantity */}

          <div className="space-y-2">

            <Label htmlFor="quantity">

              पाऊच संख्या
              {" "}
              <span className="text-muted-foreground">
                (₹{rates.pouch} प्रति पाऊच)
              </span>

            </Label>


            <Input
              id="quantity"
              type="number"
              min={1}
              placeholder="किती पाऊच?"
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

            <Label htmlFor="amountPaid">
              मिळालेली रक्कम (₹)
            </Label>


            <Input
              id="amountPaid"
              type="number"
              placeholder="रक्कम टाका"
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



          {/* Summary */}

          <div className="
            rounded-xl
            border
            bg-muted/30
            p-5
            space-y-4
          ">


            <div className="
              flex
              justify-between
              text-lg
              font-semibold
            ">

              <span>
                एकूण रक्कम
              </span>

              <span>
                {formatCurrency(total)}
              </span>

            </div>



            <div className="
              flex
              justify-between
            ">

              <span>
                मिळाले
              </span>

              <span className="text-green-600 font-medium">

                {formatCurrency(amountPaid)}

              </span>

            </div>




            <div className="
              flex
              justify-between
            ">

              <span>
                बाकी
              </span>


              <span className="
                text-red-600
                font-medium
              ">

                {formatCurrency(remaining)}

              </span>


            </div>



            <div className="
              border-t
              pt-4
              flex
              justify-between
              items-center
            ">

              <span className="font-semibold">
                पेमेंट स्थिती
              </span>


              <Badge
                variant={
                  paymentStatus === "Paid"
                    ? "default"
                    : "destructive"
                }
              >

                {paymentStatus === "Paid"
                  ? "पूर्ण भरले"
                  : "बाकी आहे"}

              </Badge>


            </div>


          </div>



          <Button
            type="submit"
            disabled={isSaving}
            className="w-full h-11 text-base"
          >

            {
              isSaving
                ? "जतन करत आहे..."
                : "विक्री जतन करा"
            }

          </Button>


        </form>


      </CardContent>

    </Card>
  );
}