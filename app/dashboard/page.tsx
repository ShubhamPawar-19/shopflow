import { StatCard } from "@/components/dashboard/stat-card";
import { getDashboardStats } from "@/lib/google/dashboard";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { groupSalesByDate } from "@/lib/google/utils";
import {
  DollarSign,
  ShoppingCart,
  BadgeCheck,
  Clock3,
} from "lucide-react";

export default async function DashboardPage() {
    const stats = await getDashboardStats();
    const groupedSales = groupSalesByDate(
        stats.recentSales
    );

    return (
        <main className="container mx-auto py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>

                <p className="text-muted-foreground">
                    Shop overview
                </p>
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
            <RecentSales groups={groupedSales} />
        </main>
    );
}