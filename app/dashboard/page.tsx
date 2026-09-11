import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  DollarSign,
  FileText,
  PlusIcon,
  ShoppingCart,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { SendDailyReportButton } from "@/components/dashboard/send-daily-report-button";

import { getDashboardStats } from "@/lib/google/dashboard";
import { groupSalesByDate } from "@/lib/google/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const groupedSales = groupSalesByDate(stats.recentSales);

  return (
    <main className="min-h-screen bg-[#f6f5f2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}

        <section className="flex flex-col gap-6 rounded-2xl border bg-white p-6 shadow-sm sm:p-7 md:flex-row md:items-center md:justify-between">
          {/* Header Actions */}

          <div className="flex justify-between">
            <SendDailyReportButton />

            <Link href="/dashboard/sales/new">
              <Button
                size="lg"
                className="w-full bg-amber-600 font-semibold text-white shadow-sm hover:bg-amber-700 sm:w-auto"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                नवीन विक्री
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats */}

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">
                आजचा आढावा
              </h2>

              <p className="mt-0.5 text-sm text-muted-foreground">
                आजच्या विक्री आणि पेमेंटची स्थिती
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="आजची विक्री"
              value={`₹${stats.todayRevenue}`}
              icon={DollarSign}
            />

            <StatCard
              title="आजचे ऑर्डर"
              value={stats.todaySales}
              icon={ShoppingCart}
            />

            <StatCard
              title="जमा रक्कम"
              value={`₹${stats.paidRevenue}`}
              icon={BadgeCheck}
            />

            <StatCard
              title="बाकी रक्कम"
              value={`₹${stats.creditRevenue}`}
              icon={Clock3}
            />
          </div>
        </section>

        {/* Quick Actions */}

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold">
              झटपट कृती
            </h2>

            <p className="mt-0.5 text-sm text-muted-foreground">
              रोजच्या कामासाठी आवश्यक पर्याय
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">

            {/* Customers */}

            <Link
              href="/dashboard/customers"
              className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-50 transition-transform duration-300 group-hover:scale-125" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                    <Users className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">
                      फ्रँचायझी ग्राहक
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      ग्राहकांची माहिती आणि बाकी रक्कम पहा
                    </p>
                  </div>
                </div>

                <ArrowRight className="h-5 w-5 text-muted-foreground transition-all duration-200 group-hover:translate-x-1 group-hover:text-amber-600" />
              </div>
            </Link>

            {/* New Order */}

            <Link
              href="/dashboard/sales/new"
              className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-50 transition-transform duration-300 group-hover:scale-125" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                    <FileText className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">
                      नवीन ऑर्डर
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      नवीन फ्रँचायझी विक्री नोंदवा
                    </p>
                  </div>
                </div>

                <ArrowRight className="h-5 w-5 text-muted-foreground transition-all duration-200 group-hover:translate-x-1 group-hover:text-amber-600" />
              </div>
            </Link>

          </div>
        </section>

        {/* Recent Sales */}

        <RecentSales groups={groupedSales} />
      </div>
    </main>
  );
}