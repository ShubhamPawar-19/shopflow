import Image from "next/image";
import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  BadgeCheck,
  Clock3,
  PlusIcon,
  Users,
  FileText,
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
    <main className="container mx-auto py-8 space-y-8">

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/images/logo.png"
            alt="गुरुकृपा"
            width={72}
            height={72}
            className="rounded-full border shadow-md object-cover"
            priority
          />

          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              गुरुकृपा
            </h1>

            <p className="text-muted-foreground">
              फ्रँचायझी व्यवस्थापन प्रणाली
            </p>
          </div>
        </div>


        <div className="flex gap-3">
          <SendDailyReportButton />

          <Link href="/dashboard/sales/new">
            <Button size="lg">
              <PlusIcon className="mr-2 h-4 w-4" />
              नवीन विक्री
            </Button>
          </Link>
        </div>
      </div>


      {/* Stats */}
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


      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">

        <Link href="/dashboard/customers">

          <div
            className="
              rounded-xl
              border
              p-6
              hover:bg-muted/50
              transition
              cursor-pointer
            "
          >

            <div className="flex items-center gap-3">

              <Users className="h-6 w-6" />

              <div>
                <h2 className="font-semibold text-lg">
                  फ्रँचायझी ग्राहक
                </h2>

                <p className="text-sm text-muted-foreground">
                  ग्राहकांची माहिती आणि बाकी रक्कम पहा
                </p>
              </div>

            </div>

          </div>

        </Link>



        <Link href="/dashboard/sales/new">

          <div
            className="
              rounded-xl
              border
              p-6
              hover:bg-muted/50
              transition
              cursor-pointer
            "
          >

            <div className="flex items-center gap-3">

              <FileText className="h-6 w-6" />

              <div>
                <h2 className="font-semibold text-lg">
                  नवीन ऑर्डर
                </h2>

                <p className="text-sm text-muted-foreground">
                  नवीन फ्रँचायझी विक्री नोंदवा
                </p>
              </div>

            </div>

          </div>

        </Link>

      </div>


      {/* Sales Table */}
      <RecentSales groups={groupedSales} />


    </main>
  );
}