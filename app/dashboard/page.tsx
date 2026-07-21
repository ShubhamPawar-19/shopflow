import { StatCard } from "@/components/dashboard/stat-card";
import { getDashboardStats } from "@/lib/google/dashboard";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { groupSalesByDate } from "@/lib/google/utils";
import {
  DollarSign,
  ShoppingCart,
  BadgeCheck,
  Clock3,
  PlusIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SendDailyReportButton } from "@/components/dashboard/send-daily-report-button";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const groupedSales = groupSalesByDate(
    stats.recentSales
  );

  return (
    <main className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <p className="text-muted-foreground">
            Shop overview
          </p>
        </div>

        <SendDailyReportButton />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Today's Revenue"
          value={`₹${stats.todayRevenue}`}
          icon={DollarSign}
        />

        <StatCard
          title="Today's Sales"
          value={stats.todaySales}
          icon={ShoppingCart}
        />

        <StatCard
          title="Paid"
          value={`₹${stats.paidRevenue}`}
          icon={BadgeCheck}
        />

        <StatCard
          title="Credit"
          value={`₹${stats.creditRevenue}`}
          icon={Clock3}
        />
      </div>
      <div className="flex gap-4 justify-center items-center">
        <Link href="/dashboard/customers">
          <Button>Customers</Button>
        </Link>

        <Link href="/dashboard/sales/new">
          <Button>
            <PlusIcon/>
            New Sale
          </Button>
        </Link>
      </div>
      <RecentSales groups={groupedSales} />
    </main>
  );
}