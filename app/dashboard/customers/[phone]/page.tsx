import { getSales } from "@/lib/google/sales";
import { getPaymentsByCustomerPhone } from "@/lib/google/payments";

import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  IndianRupee,
  Package,
  Phone,
  Wallet,
} from "lucide-react";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { CustomerSaleActions } from "@/components/dashboard/customer-sale-actions";
import {
  formatCurrency,
  formatDate,
} from "@/lib/utils/format";

import { SendReminderButton } from "@/components/dashboard/send-reminder-button";

interface Props {
  params: Promise<{
    phone: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function CustomerPage({
  params,
}: Props) {
  const { phone } = await params;

  const sales = await getSales();

  const customerSales = sales.filter(
    (sale) => sale.phone === phone
  );

  const customerPayments = (
    await getPaymentsByCustomerPhone(phone)
  ).sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  );

  const customer = customerSales[0];

  if (!customer) {
    return (
      <main className="min-h-screen bg-[#f6f5f2] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-dashed bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Package className="h-7 w-7" />
            </div>

            <p className="mt-4 font-semibold">
              फ्रँचायझी माहिती उपलब्ध नाही.
            </p>

            <Link
              href="/dashboard/customers"
              className="mt-4 inline-flex text-sm font-medium text-amber-700 hover:text-amber-800"
            >
              ग्राहक यादीकडे परत जा
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const totalPurchases = customerSales.reduce(
    (sum, sale) => sum + sale.total,
    0
  );

  const totalPaid = customerSales.reduce(
    (sum, sale) => sum + sale.amountPaid,
    0
  );

  const outstanding = customerSales.reduce(
    (sum, sale) => sum + sale.amountRemaining,
    0
  );

  return (
    <main className="min-h-screen bg-[#f6f5f2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Back */}

        <Link
          href="/dashboard/customers"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-amber-700"
        >
          <ArrowLeft className="h-4 w-4" />
          ग्राहक यादी
        </Link>


        {/* Customer Header */}

        <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">

          <div className="bg-gradient-to-r from-amber-50/80 via-white to-white p-6 sm:p-7">

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div className="flex items-start gap-4">

                {/* Avatar */}

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-xl font-bold text-amber-700 ring-1 ring-amber-200">
                  {customer.customer
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>

                  <div className="flex flex-wrap items-center gap-2">

                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                      {customer.customer}
                    </h1>

                    <Badge
                      variant="secondary"
                      className="border-amber-100 bg-amber-50 text-amber-700 hover:bg-amber-50"
                    >
                      Franchise
                    </Badge>

                  </div>

                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {customer.phone}
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    फ्रँचायझी ग्राहक खाते
                  </p>

                </div>

              </div>


              {/* Reminder */}

              {outstanding > 0 && (
                <SendReminderButton
                  customer={customer.customer}
                  phone={customer.phone}
                  amount={outstanding}
                />
              )}

            </div>

          </div>

        </section>


        {/* Financial Summary */}

        <section>

          <div className="mb-4">
            <h2 className="text-lg font-bold">
              खाते सारांश
            </h2>

            <p className="mt-0.5 text-sm text-muted-foreground">
              ग्राहकाच्या एकूण व्यवहाराची स्थिती
            </p>
          </div>


          <div className="grid gap-4 md:grid-cols-3">

            {/* Total Purchases */}

            <div className="group rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    एकूण खरेदी
                  </p>

                  <p className="mt-3 text-2xl font-bold tracking-tight">
                    {formatCurrency(totalPurchases)}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <IndianRupee className="h-5 w-5" />
                </div>

              </div>

              <div className="mt-5 h-1 w-10 rounded-full bg-amber-500 transition-all duration-200 group-hover:w-16" />

            </div>


            {/* Total Paid */}

            <div className="group rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    जमा रक्कम
                  </p>

                  <p className="mt-3 text-2xl font-bold tracking-tight text-green-600">
                    {formatCurrency(totalPaid)}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <Wallet className="h-5 w-5" />
                </div>

              </div>

              <div className="mt-5 h-1 w-10 rounded-full bg-green-500 transition-all duration-200 group-hover:w-16" />

            </div>


            {/* Outstanding */}

            <div className="group rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    बाकी रक्कम
                  </p>

                  <p
                    className={
                      outstanding > 0
                        ? "mt-3 text-2xl font-bold tracking-tight text-red-600"
                        : "mt-3 text-2xl font-bold tracking-tight text-green-600"
                    }
                  >
                    {formatCurrency(outstanding)}
                  </p>
                </div>

                <div
                  className={
                    outstanding > 0
                      ? "flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600"
                      : "flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600"
                  }
                >
                  <CreditCard className="h-5 w-5" />
                </div>

              </div>

              <div
                className={
                  outstanding > 0
                    ? "mt-5 h-1 w-10 rounded-full bg-red-500 transition-all duration-200 group-hover:w-16"
                    : "mt-5 h-1 w-10 rounded-full bg-green-500 transition-all duration-200 group-hover:w-16"
                }
              />

            </div>

          </div>

        </section>


        {/* Order History */}

        <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">

          <div className="border-b bg-gradient-to-r from-amber-50/60 to-white p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Package className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  ऑर्डर इतिहास
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  ग्राहकाच्या सर्व विक्रीची माहिती
                </p>
              </div>

            </div>

          </div>


          <div>

            {customerSales.map((sale) => (

              <div
                key={sale.id}
                className="border-b p-5 last:border-b-0 sm:p-6"
              >

                {/* Order Header */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                  <div>

                    <div className="flex items-center gap-2">

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      </div>

                      <p className="font-semibold">
                        {formatDate(sale.date)}
                      </p>

                    </div>

                    <p className="mt-2 text-sm text-muted-foreground">
                      📦 {sale.quantity} पाऊच
                    </p>

                  </div>


                  <div className="flex flex-col items-start gap-2 sm:items-end">

                    <p className="text-xl font-bold">
                      {formatCurrency(sale.total)}
                    </p>

                    <CustomerSaleActions sale={sale} />

                  </div>

                </div>


                {/* Payment Status */}

                <div className="mt-5 flex flex-col gap-4 rounded-xl border bg-[#faf9f6] p-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="grid gap-3 sm:grid-cols-2">

                    <div>
                      <p className="text-xs text-muted-foreground">
                        भरले
                      </p>

                      <p className="mt-1 font-semibold text-green-600">
                        {formatCurrency(sale.amountPaid)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        बाकी
                      </p>

                      <p
                        className={
                          sale.amountRemaining > 0
                            ? "mt-1 font-semibold text-red-600"
                            : "mt-1 font-semibold text-green-600"
                        }
                      >
                        {formatCurrency(
                          sale.amountRemaining
                        )}
                      </p>
                    </div>

                  </div>


                  <Badge
                    className={
                      sale.paymentStatus === "Paid"
                        ? "w-fit gap-1.5 border-green-200 bg-green-50 text-green-700 hover:bg-green-50"
                        : "w-fit gap-1.5 border-red-200 bg-red-50 text-red-700 hover:bg-red-50"
                    }
                  >
                    {sale.paymentStatus === "Paid"
                      ? "✓ पूर्ण भरले"
                      : "बाकी"}
                  </Badge>

                </div>


                {/* Reminder */}

                {sale.amountRemaining > 0 && (
                  <div className="mt-4 flex justify-end">
                    <SendReminderButton
                      customer={sale.customer}
                      phone={sale.phone}
                      amount={sale.amountRemaining}
                    />
                  </div>
                )}

              </div>

            ))}

          </div>

        </section>


        {/* Payment History */}

        <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">

          <div className="border-b bg-gradient-to-r from-green-50/50 to-white p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <Wallet className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  पेमेंट इतिहास
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  ग्राहकाकडून मिळालेल्या सर्व पेमेंटची नोंद
                </p>
              </div>

            </div>

          </div>


          <div className="p-6">

            {customerPayments.length === 0 ? (

              <div className="rounded-xl border border-dashed bg-[#faf9f6] p-8 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                </div>

                <p className="mt-3 font-medium">
                  अजून पेमेंट नोंद नाही.
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  ग्राहकाकडून पेमेंट मिळाल्यावर ते येथे दिसेल.
                </p>

              </div>

            ) : (

              <div className="divide-y">

                {customerPayments.map((payment) => (

                  <div
                    key={payment.id}
                    className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                        <Wallet className="h-4 w-4" />
                      </div>

                      <div>

                        <p className="font-medium">
                          {payment.paymentMode}
                        </p>

                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {formatDate(payment.date)}
                        </p>

                      </div>

                    </div>


                    <p className="font-bold text-green-600">
                      +{formatCurrency(payment.amount)}
                    </p>

                  </div>

                ))}

              </div>

            )}

          </div>

        </section>

      </div>
    </main>
  );
}